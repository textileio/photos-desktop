import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import GroupMenu from './GroupMenu'
import PeerMenu from './PeerMenu'
import FeedView from './FeedView'
import InfoSidebar from './InfoSidebar'
import OmniForm from '../Components/OmniForm'
import GroupSummary from '../Components/GroupSummary'
import copy from 'copy-to-clipboard'
import { Grid, Menu, Sidebar, Image, Feed, Label } from 'semantic-ui-react'

@inject('store') @observer
class Main extends Component {
  handleSubmit = data => {
    const { store } = this.props
    const group = store.groups[store.currentGroupId].id
    if (data.file !== null) {
      const form = new window.FormData()
      form.append('file', data.file, data.filename)
      store.addFile(group, form, data.caption)
    } else if (data.message !== '') {
      store.addMessage(group, data.message)
    }
  }
  render () {
    const { store } = this.props
    return (
      <Sidebar.Pushable>
        <InfoSidebar />
        <Sidebar.Pusher>
          <Grid stretched celled columns={2}>
            <Grid.Row>
              <Grid.Column width={3}>
                <Feed.Label>
                  <Image avatar src={store.profile.url} />
                  <span
                    title='click to copy node address'
                    onClick={() => { copy(store.profile.address) }}
                    style={{ fontWeight: 'bold', fontSize: '1.2em', cursor: 'pointer' }}
                  >
                    {store.profile.username}
                  </span>
                </Feed.Label>
              </Grid.Column>
              <Grid.Column width={13}>
                <GroupSummary group={store.currentGroup} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={3} style={{ overflowY: 'auto', height: 'calc(100vh - 75px)' }}>
                <Menu fluid vertical borderless>
                  <GroupMenu />
                  <PeerMenu />
                </Menu>
              </Grid.Column>
              <Grid.Column width={13} style={{ padding: 0 }}>
                <Grid.Row style={{ overflowY: 'auto', height: 'calc(100vh - 140px)' }}>
                  <FeedView />
                </Grid.Row>
                <Grid.Row style={{ padding: '0 1em' }}>
                  <OmniForm images onSubmit={this.handleSubmit} />
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default Main
