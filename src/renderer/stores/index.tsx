import { AppStore } from './node'
import { UserStore } from './user'
export * from './models'

export interface Stores {
  store: AppStore
  user: UserStore
}

const store = new AppStore()
const user = new UserStore()

const stores: Stores = {
  store,
  user,
}

export default stores
