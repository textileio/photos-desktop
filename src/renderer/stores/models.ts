import { Peer } from '@textile/js-http-client'
import { FeedEventProps } from 'semantic-ui-react'
import { IpcRenderer } from 'electron'

export interface IpcRendererEvent {
  sender: IpcRenderer
}

export interface Repo {
  path: string
  name: string
  valid: boolean
}

export interface FeedEvent extends FeedEventProps {
  date?: string
  next?: string
  count?: number
  user?: Peer
  removable?: boolean
}
export interface FeedEventList {
  items: FeedEvent
  count: number
  next: string
}

export interface Invite {
  id: string
  name?: string
  key?: string
  inviter?: string
  referral?: string
}
