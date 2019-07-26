import { action, computed, observable, runInAction } from 'mobx'
import textile, { Peer, ContactList, ThreadList, FeedItem, File as FileType, Thread, Contact } from '@textile/js-http-client'
import { toast } from 'react-semantic-toasts'
import { SemanticSIZES, FeedEventProps } from 'semantic-ui-react'
import uuid from 'uuid/v4'
import isElectron from 'is-electron'
import copy from 'copy-to-clipboard'
const { ipcRenderer } = window

// tslint:disable-next-line:no-empty-interface
export interface Store { }
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

interface Invite {
  id: string
  name?: string
  key?: string
  inviter?: string
  referral?: string
}

const catchError = (err: Error) => {
  toast({
    type: 'error',
    icon: 'frown outline',
    title: 'Something went wrong!',
    description: err.toString(),
    time: 0
  })
}

// Currently a static store that fetches data from peer on init
export class AppStore implements Store {
  gateway: string = 'http://127.0.0.1:5050'
  @observable profile?: Contact
  @observable imageSize: SemanticSIZES = 'large'
  @observable contacts?: ContactList
  @observable online: boolean = false
  @observable groups?: ThreadList
  @observable currentItemId?: number
  @observable currentGroupId?: number
  @observable currentFeed?: FeedEventList
  @observable invite?: Invite
  @observable openInviteModal: boolean = false
  constructor() {
    setInterval(async () => {
      const invites = await textile.invites.list()
      // Only process the most recent invite each time
      if (invites.items.length > 0 && this.invite === undefined) {
        runInAction(() => {
          const invite = invites.items[0]
          this.invite = {
            ...invite, inviter: invite.inviter.name || invite.inviter.address.slice(0, 8)
          }
        })
      }
    }, 10000)
    textile.observe.events()
    .then((stream) => {
      const reader = stream.getReader()
      const read = (result: ReadableStreamReadResult<FeedItem>) => {
        if (result.done) {
          return
        }
        try {
          this.fetchGroups()
          this.fetchContacts()
          if (this.currentGroupId !== undefined && this.currentGroupId !== null) {
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
    if (isElectron()) {
      // Only handle deep link invites from within electron
      ipcRenderer.on('invite', (_: any, invite: Invite) => {
        runInAction(() => {
          this.invite = invite
        })
      })
    }
  }
  // Group actions
  @action async createGroup(name: string) {
    try {
      if (this.online) {
        // TODO: We can't assume the 'media' thread will be available
        const schema = (await textile.schemas.defaults()).media
        const key = `textile_photos-shared-${uuid()}`
        await textile.threads.add(name, schema, key, 'open', 'shared')
        await this.fetchGroups()
        runInAction(() => {
          this.currentGroupId = this.groups ? this.groups.items.length - 1 : 0
        })
      }
    } catch (err) {
      catchError(err)
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
      catchError(err)
    }
  }
  @action async leaveGroup(groupId: string) {
    try {
      await textile.threads.remove(groupId)
      runInAction(() => {
        this.currentGroupId = undefined
      })
      this.fetchGroups()
    } catch (err) {
      catchError(err)
    }
  }
  @action async joinGroup(invite: Invite, reject?: boolean) {
    try {
      if (reject) {
        await textile.invites.ignore(invite.id)
      } else {
        await textile.invites.accept(invite.id, invite.key)
      }
      runInAction(() => {
        this.invite = undefined
      })
      toast({
        icon: 'smile outline',
        title: 'Success',
        description: `${reject ? 'ignored' : 'joined'} group '${invite.name || 'unknown group'}'`,
        time: 3000
      })
    } catch (err) {
      catchError(err)
    }
  }
  async addInvite(groupId: string, address?: string) {
    try {
      if (!address) {
        const invite = await textile.invites.addExternal(groupId)
        if (this.currentGroup) {
          const name = this.currentGroup.name
          const hash: string[] = []
          hash.push(`id=${encodeURIComponent(invite.id)}`)
          hash.push(`key=${encodeURIComponent(invite.key)}`)
          hash.push(`inviter=${encodeURIComponent(invite.inviter)}`)
          hash.push(`name=${encodeURIComponent(name)}`)
          hash.push(`name=${encodeURIComponent('MCSES')}`)
          copy(`https://www.textile.photos/invites/new#${hash.join('&')}`)
          toast({
            icon: 'smile outline',
            title: 'Invite link',
            description: 'Copied link to clipboard!',
            time: 3000
          })
        }
      } else {
        await textile.invites.add(groupId, address)
      }
    } catch (err) {
      catchError(err)
    }
  }
  @action async fetchProfile() {
    try {
      const profile = await textile.account.contact()
      profile.name = profile.name || profile.address.slice(-8)
      // if (profile.avatar) {
      //   profile.avatar = `${this.gateway}/ipfs/${profile.avatar}/0/small/content`
      // }
      runInAction(() => {
        this.profile = profile
        this.online = true
      })
    } catch (err) {
      toast({
        type: 'error',
        icon: 'power cord',
        title: 'Offline?',
        description: `Looks like your Textile peer is offline 😔...`,
        time: 0
      })
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
      catchError(err)
    }
  }
  @action async ignoreItem(id: string) {
    try {
      if (this.online) {
        await textile.blocks.ignore(id)
      }
    } catch (err) {
      catchError(err)
    }
  }
  @action async addLike(id: string) {
    try {
      if (this.online) {
        await textile.likes.add(id)
      }
    } catch (err) {
      catchError(err)
    }
  }
  @action async addComment(id: string, message: string) {
    try {
      if (this.online) {
        await textile.comments.add(id, message)
      }
    } catch (err) {
      catchError(err)
    }
  }
  @action async addMessage(thread: string, message: string) {
    try {
      if (this.online) {
        await textile.messages.add(thread, message)
      }
    } catch (err) {
      catchError(err)
    }
  }
  @action async addFile(thread: string, file: File, message: string) {
    try {
      if (this.online) {
        await textile.files.add(file, message, thread)
      }
    } catch (err) {
      catchError(err)
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
            if (feedItem.user && this.profile) {
              feedItem.removable = feedItem.user.address === this.profile.address
            }
            switch (type) {
              case '/Files':
                feedItem.summary = `added a photo`
                feedItem.extraText = payload.caption
                feedItem.extraImages = payload.files.map((file: FileType) => {
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
                feedItem.removable = false
                break
              case '/Leave':
                feedItem.summary = `left the '${group.name}' group`
                feedItem.comments = undefined
                feedItem.likes = undefined
                feedItem.removable = false
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
                feedItem.removable = false
            }
            return feedItem
          })
        this.currentFeed = { items, count: feed.count, next: feed.next }
      }
    } catch (err) {
      catchError(err)
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
