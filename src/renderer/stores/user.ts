import { ignore } from 'mobx-sync'
import { observable, runInAction, action } from 'mobx'
import { Repo } from './models'
import { ipcRenderer } from 'electron'
import { navigate } from '@reach/router'

export class UserStore {
  @ignore
  loaded: boolean = false
  @ignore
  @observable
  page: string = 'default'
  @action
  setPage(page: string) {
    this.page = page
    navigate(`/${page}`)
  }
  @ignore
  @observable
  repos: Repo[] = [] // @note: keep first record as latest repo
  constructor() {
    ipcRenderer.on('initialized', (_event: any, repo: Repo) => {
      runInAction(() => {
        this.repos.unshift(repo)
      })
    })
    // observe(this, 'page', (change: any) => {
    //   navigate(change.newValue as string)
    // })
  }
}
