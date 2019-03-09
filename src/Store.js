import React from 'react'
import { action, computed, observable, runInAction } from 'mobx'
import { Textile } from '@textileio/js-http-client'
import { toast } from 'react-semantic-toasts'

const textile = new Textile({
  url: 'http://127.0.0.1',
  port: 40602
})

// Currently a static store that fetches data from peer on init
class Store {
  @action async fetchProfile () {
    try {
      const profile = await textile.profile.get()
      if (!profile.username) {
        profile.username = profile.address.slice(-8)
      }
      runInAction(() => {
        this.profile = profile
        this.online = true
      })
    } catch (err) {
      toast({
        title: 'Offline?',
        description: (
          <div>
            Looks like your Textile peer is offline
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
  @action async fetchGroupData (id) {
    try {
      if (this.online) {
        const feed = await textile.feed.get({
          thread: this.groups[id].id,
          limit: 50,
          mode: 'annotated'
        })
        this.groups[id].feed = feed.items
          .filter(item => item.payload['@type'] === '/Files')
          .map(item => {
            const image = item.payload.files[0].links.large
            const base = `${this.gateway}/ipfs/${image.hash}`
            const src = image.key ? base + `?key=${image.key}` : base
            return {
              src,
              id: item.id,
              comments: [
                {
                  id: 0,
                  ...item.payload.user,
                  avatar: `${this.gateway}/ipfs/${item.payload.user.avatar}/0/small/d`,
                  date: item.payload.date,
                  body: item.payload.caption
                }
              ],
              likes: [
                { id: 'one' },
                { id: 'two' }
              ]
            }
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
  gateway = 'http://127.0.0.1:5052'
  profile = null
  @observable online = false
  @observable groups = null
  @observable currentGroupId = null
}

export default Store
