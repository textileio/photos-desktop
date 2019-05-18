import React from 'react'
import { observer } from 'mobx-react'
import GroupMenu from './GroupMenu'
import PeerMenu from './PeerMenu'
import FeedView from './FeedView'
import InfoSidebar from './InfoSidebar'
import OmniForm, { OmniFormState } from '../Components/OmniForm'
import GroupSummary from './GroupSummary'
import copy from 'copy-to-clipboard'
import { Grid, Sidebar, Image, Feed, Confirm } from 'semantic-ui-react'
import { ConnectedComponent, connect } from '../Components/ConnectedComponent'
import { Stores } from '../Store'

@connect('store') @observer
class Main extends ConnectedComponent<{}, Stores> {
  handleSubmit = (data: OmniFormState) => {
    const { store } = this.stores
    if (!store.groups || store.currentGroupId === undefined) {
      return
    }
    const group = store.groups.items[store.currentGroupId].id
    if (data.file) {
      store.addFile(group, data.file, data.message || '')
    } else if (data.message) {
      store.addMessage(group, data.message)
    }
  }
  handleJoinCancel = () => {
    const { store } = this.stores
    if (store.invite) {
      store.joinGroup(store.invite, true)
    }
  }
  handleJoinConfirm = () => {
    const { store } = this.stores
    if (store.invite) {
      store.joinGroup(store.invite)
    }
  }
  render() {
    const { store } = this.stores
    return (
      <div>
        <Sidebar.Pushable>
          <InfoSidebar />
          <Sidebar.Pusher>
            <Grid stretched celled columns={2}>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Feed.Label style={{ maxWidth: 'calc(100%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {store.profile && <Image avatar src={`${store.gateway}/ipfs/${store.profile.avatar}/0/small/content`} />}
                    <span
                      title='click to copy node address'
                      onClick={() => { copy(store.profile ? store.profile.address : '') }}
                      style={{ fontWeight: 'bold', fontSize: '1.2em', cursor: 'pointer' }}
                    >
                      {store.profile && store.profile.name}
                    </span>
                  </Feed.Label>
                </Grid.Column>
                <Grid.Column width={13}>
                  <GroupSummary />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={3} style={{ overflowY: 'auto', height: 'calc(100vh - 75px)' }}>
                  <div>
                    <GroupMenu />
                    <PeerMenu />
                  </div>
                </Grid.Column>
                <Grid.Column width={13} style={{ padding: 0 }}>
                  <Grid.Row>
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
        <Confirm
          open={store.invite !== undefined}
          header='Join a group?'
          content={`You've been invited to join ${store.invite && store.invite.name}`}
          onCancel={this.handleJoinCancel}
          onConfirm={this.handleJoinConfirm}
        />
      </div>
    )
  }
}

export default Main
