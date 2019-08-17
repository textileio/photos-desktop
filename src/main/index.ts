import { app, BrowserWindow, ipcMain, Menu, shell, MenuItemConstructorOptions, IpcMainEvent } from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'
import queryString from 'query-string'
import { DaemonFactory, Daemon } from '@textile/go-daemon'
import urlParse from 'url-parse'
import keytar from 'keytar'
import Wallet, { Keypair } from '@textile/wallet'
import bip39 from 'bip39'
import textile from '@textile/js-http-client'
import fs from 'fs'

const isDevelopment = process.env.NODE_ENV !== 'production'
let mainWindow: BrowserWindow | null
let daemon: Daemon | null
let invite: string

const handleLink = (link: string[]) => {
  const parsed = urlParse(link.join(''))
  if (parsed.pathname !== '/invites/new') {
    return
  }
  invite = queryString.parse(parsed.hash.slice(1)).toString()
}

const lock = app.requestSingleInstanceLock()
if (!lock) {
  app.quit()
} else {
  app.on('second-instance', (_event, commandLine) => {
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

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    height: 500,
    width: 800,
  })

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  // Protocol handler for windows
  if (process.platform === 'win32') {
    // Keep only command line / deep linked arguments
    handleLink(process.argv.slice(1))
  }

  window.once('ready-to-show', () => {
    window.show()
    if (invite) {
      window.webContents.send('invite', invite)
    }
    ipcMain.on('open-external-window', (_: any, arg: any) => {
      shell.openExternal(arg)
    })
  })

  return window
}

const createMainMenu = () => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          role: 'about',
          label: 'About Textile Photos',
        },
        {
          role: 'quit',
          label: 'Quit Textile Photos',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
        },
        {
          role: 'forceReload',
        },
        {
          role: 'toggleDevTools',
        },
        {
          type: 'separator',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize',
        },
        {
          role: 'close',
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          click() {
            shell.openExternal('https://textile.photos')
          },
          label: 'Learn More',
        },
        {
          click() {
            shell.openExternal('https://github.com/textileio/photos-desktop/issues')
          },
          label: 'File Issue on GitHub',
        },
      ],
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  return menu
}

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
  createMainMenu()
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    installer.default(installer['REACT_DEVELOPER_TOOLS'], forceDownload).catch(console.log)
  }
})

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// Define custom protocol handler. Deep linking works on packaged versions of the application!
app.setAsDefaultProtocolClient('textile')

// Protocol handler for osx
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleLink([url])
})

ipcMain.on('load-page', (_event: IpcMainEvent, ...args: any[]) => {
  if (mainWindow) {
    mainWindow.loadURL(args[0])
  }
})

ipcMain.on('init', async (event: any, args: any) => {
  event.reply('message', 'initializing repo')
  const { seed, name, pincode } = args
  let secret = seed
  let mnemonic: string | undefined = undefined
  if (!secret) {
    mnemonic = bip39.generateMnemonic()
    const wallet = new Wallet(mnemonic)
    secret = wallet.accountAt(0).keypair.secret()
  }
  try {
    const keypair = Keypair.fromSecret(secret)
    const address = keypair.publicKey()
    const repoPath = path.join(app.getPath('userData'), address).replace('Electron', 'Textile')
    // @todo: move to render process?
    // const mnemonic = await keytar.getPassword('io.textile.desktop', username)
    const df = new DaemonFactory()
    event.reply('message', 'spawining daemon')
    // eslint-disable-next-line prettier/prettier
    daemon = await df.spawn({ disposable: false, repoPath })
    event.reply('message', 'creating repo')
    await daemon.init(secret, { pincode })
    event.reply('initialized', { name, path: daemon.repoPath })
    await keytar.setPassword('io.textile.desktop', `${name}.${address}`, mnemonic || seed)
    console.log('passphrase/key stored in user keychain')
  } catch (err) {
    event.reply('error', err.toString())
  }
})

ipcMain.on('start', async (event: any, args: any) => {
  event.reply('message', 'starting daemon')
  const { repoPath, pincode } = args
  try {
    const df = new DaemonFactory()
    daemon = await df.spawn({ disposable: false, repoPath })
    await daemon.start({ serveDocs: true, pincode })
    event.reply('started', daemon)
  } catch (err) {
    event.reply('error', err.toString())
  }
})

ipcMain.on('addFile', async (event: any, args: any) => {
  event.reply('message', 'adding file')
  const { thread, filePath, message } = args
  try {
    const data = () => fs.createReadStream(filePath)
    const block = await textile.files.add(data, message, thread)
    event.reply('addFile', block)
  } catch (err) {
    event.reply('error', err.toString())
  }
})
