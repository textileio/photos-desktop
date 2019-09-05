import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'
import stores from './stores'
import { AsyncTrunk } from 'mobx-sync'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'mobx-react'
import 'semantic-ui-css/semantic.min.css'
import { Repo } from './stores/models'
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

// @todo: this probably shouldn't be _here_... it should be somewhere else
const basePath = remote.app.getPath('userData').replace('Electron', 'Textile')
const getDirectories = (source: string): Repo[] =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      return { path: path.join(basePath, dirent.name), name: dirent.name.slice(0, 8), valid: true }
    })

// create a mobx-sync instance, it will:
// 1. load your state from localStorage & ssr renderred state
// 2. persist your store to localStorage automatically
// NOTE: you do not need to call `trunk.updateStore` to persist
// your store, it is persisted automatically!
const trunk = new AsyncTrunk(stores.user, { storage: localStorage })

// init the state and auto persist watcher(use mobx's autorun)
// NOTE: it will load the persisted state first (and must), and
// then load the state from ssr, if you pass it as the first
// argument of `init`, just like trunk.init(__INITIAL_STATE__)
trunk.init({ repos: getDirectories(basePath) }).then(() => {
  stores.user.loaded = true
  stores.user.repos.forEach((repo: Repo) => {
    repo.valid = fs.existsSync(repo.path)
  })
  const app = (
    <Provider {...stores}>
      <App />
    </Provider>
  )

  ReactDOM.render(app, document.getElementById('app'))

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister()
})
