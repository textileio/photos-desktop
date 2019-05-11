import React from 'react'
import { action, computed, observable, intercept, runInAction } from 'mobx'
import textile, { Peer, ContactList, ThreadList, FeedItem, File, Thread } from '@textile/js-http-client'
import { toast } from 'react-semantic-toasts'
import { SemanticSIZES, FeedEventProps } from 'semantic-ui-react'

// tslint:disable-next-line:no-empty-interface
export interface Store { }
export interface FeedEvent extends FeedEventProps {
  date?: string
  next?: string
  count?: number
  user?: Peer
}
export interface FeedEventList {
  items: FeedEvent
  count: number
  next: string
}

// Currently a static store that fetches data from peer on init
export class AppStore implements Store {
  gateway: string = 'http://127.0.0.1:5050'
  @observable profile?: Peer
  @observable imageSize: SemanticSIZES = 'large'
  @observable contacts?: ContactList
  @observable online: boolean = false
  @observable groups?: ThreadList
  @observable currentItemId?: number
  @observable currentGroupId?: number
  @observable currentFeed?: FeedEventList
  constructor() {
    textile.subscribe.stream().then(async (stream) => {
      const reader = stream.getReader()
      const read = (result: ReadableStreamReadResult<FeedItem>) => {
        if (result.done) {
          return
        }
        try {
          this.fetchGroups()
          this.fetchContacts()
          if (this.currentGroupId === undefined && this.currentGroupId === null) {
            this.fetchGroupData(this.currentGroupId)
          }
        } catch (err) {
          reader.cancel(undefined)
          return
        }
        reader.read().then(read)
      }
      reader.read().then(read)
    })
  }
  @action async fetchProfile() {
    try {
      const profile = await textile.profile.get()
      profile.name = profile.name || profile.address.slice(-8)
      // if (profile.avatar) {
      //   profile.avatar = `${this.gateway}/ipfs/${profile.avatar}/0/small/d`
      // }
      runInAction(() => {
        this.profile = profile
        this.online = true
      })
    } catch (err) {
      toast({
        icon: 'power cord',
        title: 'Offline?',
        description: `Looks like your Textile peer is offline 😔...`,
        time: 0
      })
    }
  }
  @action async createGroup(name: string) {
    try {
      if (this.online) {
        // TODO: We can't assume the 'media' thread will be available
        const schema = 'QmeVa8vUbyjHaYaeki8RZRshsn3JeYGi8QCnLCWXh6euEh'
        await textile.threads.add(name, schema, 'photos_' + Math.random(), 'open', 'shared')
        await this.fetchGroups()
        runInAction(() => {
          this.currentGroupId = this.groups ? this.groups.items.length - 1 : 0
        })
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
  }
  @action async fetchGroups() {
    try {
      if (this.online) {
        let groupId = this.currentGroupId
        const groups = await textile.threads.list()
        groups.items = groups.items.filter((item: Thread) => item.key.includes('photos'))
        if (groups.items.length > 0 && !groupId) {
          groupId = 0
        }
        runInAction(() => {
          this.currentGroupId = groupId
          this.groups = groups
        })
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
  }
  @action async fetchContacts() {
    try {
      if (this.online) {
        const contacts = await textile.contacts.list()
        runInAction(() => {
          this.contacts = contacts
        })
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
  }
  @action async addLike(id: string) {
    try {
      if (this.online) {
        await textile.likes.add(id)
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
  }
  @action async addComment(id: string, message: string) {
    try {
      if (this.online) {
        await textile.comments.add(id, message)
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
  }
  @action async addMessage(thread: string, message: string) {
    try {
      if (this.online) {
        await textile.messages.add(thread, message)
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
  }
  @action async addFile(thread: string, file: any, message: string) {
    try {
      if (this.online) {
        // tslint:disable-next-line:no-console
        console.log(file, thread, message)
        await textile.files.add(file, message, thread)
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
  }
  @action async fetchGroupData(id: number, limit?: number) {
    try {
      if (this.online && this.groups) {
        const group = this.groups.items[id]
        const feed = await textile.feed.list(group.id, undefined, limit || 50, 'stacks')
        const items = feed.items
          .map((item: FeedItem) => {
            const payload = item.payload
            const type = payload['@type']
            const feedItem: FeedEvent = {
              date: payload ? payload.date : undefined,
              user: payload ? payload.user : undefined,
              id: item.block,
              comments: payload && payload.comments || [],
              likes: payload && payload.likes || []
            }
            switch (type) {
              case '/Files':
                feedItem.summary = `added a photo`
                feedItem.extraText = payload.caption
                feedItem.extraImages = payload.files.map((file: File) => {
                  const image = file.links.large ? file.links.large : file.links.raw
                  // We use file hash directly here because we need the key anyway
                  const base = `${this.gateway}/ipfs/${image.hash}`
                  return image.key ? base + `?key=${image.key}` : base
                })
                break
              case '/Text':
                feedItem.extraText = payload.body
                break
              case '/Join':
                feedItem.summary = `joined the '${group.name}' group`
                feedItem.comments = undefined
                feedItem.likes = undefined
                break
              case '/Leave':
                feedItem.summary = `left the '${group.name}' group`
                feedItem.comments = undefined
                feedItem.likes = undefined
                break
              case '/Comment':
              case '/Like':
                feedItem.target = `#${payload.target.block}`
                feedItem.summary = `${type === '/Like' ? 'liked' : 'commented on'} a post`
                feedItem.extraText = payload.body
                feedItem.likes = undefined
                if (type === '/Like') {
                  feedItem.comments = undefined
                }
                break
              default:
                feedItem.summary = `updated the '${group.name}' group`
                feedItem.comments = undefined
                feedItem.likes = undefined
            }
            return feedItem
          })
        this.currentFeed = { items, count: feed.count, next: feed.next }
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
    }
    return true
  }
  @computed get currentGroup() {
    if (this.groups && this.currentGroupId !== undefined) {
      // TODO: Figure out better time to do this update
      this.fetchGroupData(this.currentGroupId)
      return this.groups.items[this.currentGroupId]
    }
    // tslint:disable-next-line:no-null-keyword
    return null
  }
  @computed get currentItem() {
    if (this.currentFeed && this.currentItemId !== undefined) {
      return this.currentFeed.items[this.currentItemId]
    }
    // tslint:disable-next-line:no-null-keyword
    return null
  }
  @computed get currentContacts() {
    if (this.contacts && this.currentGroup && this.currentGroupId !== undefined) {
      const id = this.currentGroup.id
      return this.contacts.items.filter((contact) => {
        return contact.threads && contact.threads.includes(id)
      })
    }
    // tslint:disable-next-line:no-null-keyword
    return null
  }
}

export interface Stores {
  store: AppStore
}
