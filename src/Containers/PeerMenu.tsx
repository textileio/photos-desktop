import React from 'react'
import { List, Icon, Image } from 'semantic-ui-react'
import { Contact } from '@textile/js-http-client'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../Components/ConnectedComponent'
import { Stores } from '../Store'

const DEFAULT_AVATAR = 'https://react.semantic-ui.com/images/wireframe/square-image.png'

@connect('store') @observer
class PeerMenu extends ConnectedComponent<{}, Stores> {
  render() {
    const { store } = this.stores
    if (store.currentContacts) {
      return (
        <div style={{ marginTop: '1em' }}>
          <List>
            <List.Item>
              PEERS
              <List.Content floated='right'>
                <Icon disabled name='add' />
              </List.Content>
            </List.Item>
          </List>
          <List selection animated verticalAlign='middle'>
            {store.currentContacts.map((peer: Contact) => this.renderItem(peer))}
          </List>
        </div>
      )
    }
    // tslint:disable-next-line:no-null-keyword
    return null
  }
  renderItem(peer: Contact) {
    const { store } = this.stores
    return (
      <List.Item key={peer.address} name={peer.address}
        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {/* <List.Icon name='user' /> */}
        <Image avatar style={{ width: '1em', height: '1em' }}
          src={peer.avatar ? `${store.gateway}/ipfs/${peer.avatar}/0/small/d` : DEFAULT_AVATAR} />
        <List.Content>
          {peer.name || peer.address.slice(-8)}
        </List.Content>
      </List.Item>
    )
  }
}

export default PeerMenu
