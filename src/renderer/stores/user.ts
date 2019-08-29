import { ignore } from 'mobx-sync'
import { observable, runInAction, observe, computed } from 'mobx'
import { Repo } from './models'
import { ipcRenderer } from 'electron'
import { navigate } from '@reach/router'

export class UserStore {
  @ignore
  loaded: boolean = false
  @ignore
  @computed
  get page() {
    return window.location.pathname
  }
  @observable
  repos: Repo[] = [] // @note: keep first record as latest repo
  constructor() {
    ipcRenderer.on('initialized', (_event: any, repo: Repo) => {
      runInAction(() => {
        this.repos.unshift(repo)
      })
    })
    observe(this, 'page', (change: any) => {
      navigate(change.newValue as string)
    })
  }
}
