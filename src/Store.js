import React from 'react'
import { action, computed, observable, intercept, runInAction } from 'mobx'
import { Textile } from '@textileio/js-http-client'
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
      if (!profile.username) {
        profile.username = profile.address.slice(-8)
      }
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
        await textile.threads.add(name, {
          type: 'open',
          sharing: 'shared',
          // TODO: We can't assume the 'media' thread will be available
          schema: 'QmeVa8vUbyjHaYaeki8RZRshsn3JeYGi8QCnLCWXh6euEh'
        })
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
        await textile.files.addFile(thread, file, message)
        this.hasUpdate = 'feed'
      }
    } catch (err) {
      console.log(err)
    }
  }
  @action async fetchGroupData (id) {
    try {
      if (this.online) {
        const group = this.groups[id]
        const feed = await textile.feed.get({
          thread: group.id,
          limit: 50, // TODO: Configure this!
          mode: 'annotated' // stacks
        })
        let lastUserAddress
        let lastType
        this.groups[id].feed = feed.items.slice().reverse()
          .map(item => {
            const payload = item.payload
            const type = payload['@type']
            // Can 'skip' user info if on-going items
            if (lastUserAddress === payload.user.address && lastType === type) {
              payload.user.skip = true
            }
            lastUserAddress = payload.user.address
            lastType = type
            let feedItem = {
              id: item.block,
              date: payload.date,
              user: payload.user,
              image: `${this.gateway}/ipfs/${payload.user.avatar}/0/small/d`
            }
            // Format comments
            if (payload.comments) {
              let commentUserAddress
              feedItem.comments = (payload.comments || []).slice().reverse().map(item => {
                if (commentUserAddress === item.user.address) {
                  item.user.skip = true
                }
                commentUserAddress = item.user.address
                return {
                  ...item,
                  image: `${this.gateway}/ipfs/${item.user.avatar}/0/small/d`
                }
              })
            }
            // Format likes
            if (payload.likes) {
              let liked = false
              feedItem.likes = (payload.likes || []).map(item => {
                // TODO: Is this unsafe inside a map?
                if (item.user.address === payload.user.address) {
                  liked = true
                }
                return {
                  ...item,
                  image: `${this.gateway}/ipfs/${item.user.avatar}/0/small/d`
                }
              })
              feedItem.liked = liked
            }
            switch (type) {
              case '/Files':
                feedItem.summary = `added a photo`
                feedItem.extraText = payload.caption
                feedItem.extraImages = payload.files.map(file => {
                  // We use file hash directly here because we need the key anyway
                  const base = `${this.gateway}/ipfs/${file.links.large.hash}`
                  return file.links.large.key ? base + `?key=${file.links.large.key}` : base
                })
                break
              case '/Text':
                feedItem.extraText = payload.body
                break
              case '/Join':
                feedItem.summary = `joined the '${group.name}' group`
                feedItem.comments = null
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
            }
            return feedItem
          })
      }
    } catch (err) {
      console.log(err)
    }
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
      return this.currentGroup.feed[this.currentItemId]
    }
    return null
  }
  gateway = 'http://127.0.0.1:5052'
  profile = null
  @observable hasUpdate = false
  @observable imageSize = 'medium'
  @observable online = false
  @observable groups = null
  @observable currentItemId = null
  @observable currentGroupId = null
}

export default Store
