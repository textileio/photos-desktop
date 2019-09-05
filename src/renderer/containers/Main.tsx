import React from 'react'
import { observer } from 'mobx-react'
import GroupMenu from './GroupMenu'
import PeerMenu from './PeerMenu'
import FeedView from './FeedView'
import InfoSidebar from './InfoSidebar'
import OmniForm, { OmniFormState } from '../components/OmniForm'
import GroupSummary from './GroupSummary'
import { Grid, Sidebar, Image, Feed, Confirm, Header } from 'semantic-ui-react'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'
import { RouteComponentProps } from '@reach/router'
import { clipboard } from 'electron'

@connect('store')
@observer
class Main extends ConnectedComponent<RouteComponentProps, Stores> {
  componentDidMount() {
    this.fetchInfo()
  }
  // componentDidUpdate() {
  //   this.fetchInfo()
  // }
  fetchInfo() {
    const { store } = this.stores
    store.fetchGroups()
    store.fetchContacts()
  }
  handleSubmit = (data: OmniFormState) => {
    const { store } = this.stores
    const zipMatch =
      data.file && (data.file.type.match('application/zip') || data.file.type.match('application/x-zip-compressed'))
    if (zipMatch && data.file) {
      store.addFacebookZip(data.file.path)
    }
    if (!store.groups || store.currentGroupId === undefined) {
      return
    }
    const group = store.groups.items[store.currentGroupId].id
    if (data.file) {
      store.addFile(group, data.file.path, data.message || '')
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
    const hasGroup = store.currentGroup
    const hasContent = hasGroup && store.currentFeed && store.currentFeed.items.length
    return (
      <div>
        <Sidebar.Pushable>
          <InfoSidebar />
          <Sidebar.Pusher>
            <Grid stretched celled columns={2}>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Feed.Label
                    style={{
                      maxWidth: 'calc(100%)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {store.profile && store.profile.avatar && <Image avatar src={store.profile.avatar} />}
                    <span
                      title="click to copy node address"
                      onClick={() => {
                        clipboard.writeText(store.profile ? store.profile.address : '')
                      }}
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
                    {hasContent && <FeedView />}
                    {!hasContent && (
                      <Header textAlign="center" style={{ marginTop: '2em' }}>
                        Nothing to see here, yet!
                        <Header.Subheader>Maybe its time to create a group 👈 or add some content 👇?</Header.Subheader>
                      </Header>
                    )}
                  </Grid.Row>
                  <Grid.Row style={{ padding: '0 1em' }}>
                    {hasGroup && <OmniForm images onSubmit={this.handleSubmit} />}
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Confirm
          open={store.invite !== undefined}
          header="Join a group?"
          content={`You've been invited to join ${store.invite && store.invite.name}`}
          onCancel={this.handleJoinCancel}
          onConfirm={this.handleJoinConfirm}
        />
      </div>
    )
  }
}

export default Main
