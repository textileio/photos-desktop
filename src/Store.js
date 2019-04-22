import React from 'react'
import { action, computed, observable, intercept, runInAction } from 'mobx'
import { Textile } from '@textile/js-http-client'
import { toast } from 'react-semantic-toasts'

const textile = new Textile({
  url: 'http://127.0.0.1',
  port: 40602
})

// const feedItemExample = {
//   date: '4 days ago',
//   image: '/images/avatar/small/justen.jpg',
//   meta: '41 Likes',
//   summary: 'Justen Kitsune added 2 new photos of you',
//   extraText: 'Look at these fun pics I found from a few years ago. Good times.',
//   extraImages: ['/images/wireframe/image.png', '/images/wireframe/image-text.png'],
// }

// Currently a static store that fetches data from peer on init
class Store {
  constructor () {
    intercept(this, 'hasUpdate', (change) => {
      switch (change.newValue) {
        case 'groups':
          this.fetchGroups()
          break
        case 'peers':
          this.fetchContacts()
          break
        case 'feed':
          this.fetchGroupData(this.currentGroupId)
          break
        default:
          break
      }
      return null
    })
  }
  @action async fetchProfile () {
    try {
      const profile = await textile.profile.get()
      profile.name = profile.name || profile.address.slice(-8)
      if (profile.avatar) {
        profile.url = `${this.gateway}/ipfs/${profile.avatar}/0/small/d`
      }
      runInAction(() => {
        this.profile = profile
        this.online = true
      })
    } catch (err) {
      toast({
        icon: 'power cord',
        title: 'Offline?',
        description: (
          <div>
            Looks like your Textile peer is offline&nbsp;
            <span role='img' aria-label='Sad face'>😔</span>
            <br />
            Try restarting your Textile tray app, then click this notification to reload.
          </div>
        ),
        onClick: () => window.location.reload(),
        time: 0
      })
    }
  }
  @action async createGroup (name) {
    try {
      if (this.online) {
        // TODO: We can't assume the 'media' thread will be available
        const schema = 'QmeVa8vUbyjHaYaeki8RZRshsn3JeYGi8QCnLCWXh6euEh'
        await textile.threads.add(name, schema, 'photos_' + Math.random(), 'open', 'shared')
        await this.fetchGroups()
        runInAction(() => {
          this.currentGroupId = this.groups.length - 1
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async fetchGroups () {
    try {
      if (this.online) {
        let groupId = this.currentGroupId
        const groups = Object.values((await textile.threads.list()).items)
        if (groups.length > 0 && groupId === null) {
          groupId = 0
        }
        runInAction(() => {
          this.currentGroupId = groupId
          this.groups = groups
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async fetchContacts (group) {
    try {
      if (this.online) {
        const contacts = (await textile.contacts.list()).items
        runInAction(() => {
          this.contacts = contacts
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async addLike (id) {
    try {
      if (this.online) {
        await textile.likes.add(id)
        this.hasUpdate = 'feed'
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async addComment (id, message) {
    try {
      if (this.online) {
        await textile.comments.add(id, message)
        this.hasUpdate = 'feed'
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async addMessage (thread, message) {
    try {
      if (this.online) {
        await textile.messages.add(thread, message)
        this.hasUpdate = 'feed'
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async addFile (thread, file, message) {
    try {
      if (this.online) {
        await textile.files.addFile(file, message, thread)
        this.hasUpdate = 'feed'
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async fetchGroupData (id, limit) {
    try {
      if (this.online) {
        const group = this.groups[id]
        const feed = await textile.feed.get(group.id, undefined, limit || 50, 'stacks')
        this.groups[id].feed = {
          items: (limit && this.groups[id].feed) ? this.groups[id].feed.items : [],
          next: feed.next,
          count: feed.count
        }
        const items = feed.items
          .map(item => {
            const payload = item.payload
            const type = payload['@type']
            let feedItem = {
              id: item.block,
              date: payload.date,
              user: payload.user
            }
            feedItem.comments = payload.comments
            feedItem.likes = payload.likes
            feedItem.liked = (feedItem.likes || []).some(like => like.user.address === this.profile.address)
            switch (type) {
              case '/Files':
                feedItem.summary = `added a photo`
                feedItem.extraText = payload.caption
                feedItem.extraImages = payload.files.map(file => {
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
                feedItem.comments = null
                feedItem.likes = null
                break
              case '/Leave':
                feedItem.summary = `left the '${group.name}' group`
                feedItem.comments = null
                feedItem.likes = null
                break
              case '/Comment':
              case '/Like':
                feedItem.target = `#${payload.target.block}`
                feedItem.summary = `${type === '/Like' ? 'liked' : 'commented on'} a post`
                feedItem.extraText = payload.body
                break
              default:
                feedItem.summary = `updated the '${group.name}' group`
                feedItem.comments = null
                feedItem.likes = null
            }
            return feedItem
          })
        this.groups[id].feed.items = items
      }
    } catch (err) {
      console.log(err)
    }
    return true
  }
  @computed get currentGroup () {
    if (this.groups && this.currentGroupId !== null) {
      // TODO: Figure out better time to do this update
      this.fetchGroupData(this.currentGroupId)
      return this.groups[this.currentGroupId]
    }
    return null
  }
  @computed get currentItem () {
    if (this.currentGroup && this.currentGroup.feed && this.currentItemId !== null) {
      return this.currentGroup.feed.items[this.currentItemId]
    }
    return null
  }
  @computed get currentContacts () {
    if (this.contacts && this.groups && this.currentGroupId !== null) {
      const id = this.currentGroup.id
      console.log([...this.contacts], id)
      return this.contacts.filter((contact) => contact.threads.includes(id))
    }
    return null
  }
  gateway = 'http://127.0.0.1:5052'
  @observable profile = null
  @observable hasUpdate = false
  @observable imageSize = 'medium'
  @observable contacts = null
  @observable online = false
  @observable groups = null
  @observable currentItemId = null
  @observable currentGroupId = null
}

export default Store
