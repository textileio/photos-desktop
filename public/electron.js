const { app, BrowserWindow, shell, ipcMain, Menu } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const url = require('url')
const queryString = require('query-string')

// TODO: Add 'deeplink' option to cookiecutter template

let mainWindow // BrowserWindow | null
let invite

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.

    // Protocol handler for windows
    // commandLine: An array of the second instance’s (command line / deep linked) arguments
    if (process.platform === 'win32') {
      // Keep only command line / deep linked arguments
      console.log(commandLine.slice(1))
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#F7F7F7',
    minWidth: 500,
    show: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, '../build', '/preload.js')
    },
    height: 500,
    width: 800
  })

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : url.format({
    pathname: path.join(__dirname, '../build', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => {
        console.log(`Added Extension: ${name}`)
      })
      .catch((err) => {
        console.log('An error occurred: ', err)
      })
  }

  // Protocol handler for windows
  if (process.platform === 'win32') {
    // Keep only command line / deep linked arguments
    handleLink(process.argv.slice(1))
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
      if (invite) {
        mainWindow.webContents.send('invite', invite)
      }
    }

    ipcMain.on('open-external-window', (_, arg) => {
      shell.openExternal(arg)
    })
  })
}

const generateMenu = () => {
  const template = [ // MenuItemConstructorOptions[]
    {
      label: 'File',
      submenu: [
        {
          role: 'about',
          label: 'About Textile Photos'
        },
        {
          role: 'quit',
          label: 'Quit Textile Photos'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        }, {
          role: 'forcereload'
        }, {
          role: 'toggledevtools'
        }, {
          type: 'separator'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [{
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          click () {
            shell.openExternal('https://textile.photos')
          },
          label: 'Learn More'
        },
        {
          click () {
            shell.openExternal('https://github.com/textileio/photos-desktop/issues')
          },
          label: 'File Issue on GitHub'
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', () => {
  createWindow()
  generateMenu()
})

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

const handleLink = (link) => {
  const parsed = url.parse(link)
  if (parsed.hostname !== 'textile.photos' && parsed.path !== '/invites/new') {
    return
  }
  invite = queryString.parse(parsed.hash.slice(1))
}

// Define custom protocol handler. Deep linking works on packaged versions of the application!
app.setAsDefaultProtocolClient('textile')

// Protocol handler for osx
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleLink(url)
})

ipcMain.on('load-page', (_, arg) => {
  if (mainWindow) {
    mainWindow.loadURL(arg)
  }
})
