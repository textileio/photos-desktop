import { ignore } from 'mobx-sync'
import { observable, runInAction } from 'mobx'
import { Repo } from './models'
import { ipcRenderer } from 'electron'

export class UserStore {
  @ignore
  loaded: boolean = false
  @observable
  repos: Repo[] = [] // @note: keep first record as latest repo
  constructor() {
    ipcRenderer.on('initialized', (_event: any, repo: Repo) => {
      runInAction(() => {
        this.repos.unshift(repo)
      })
    })
  }
}
