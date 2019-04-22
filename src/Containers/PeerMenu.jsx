import React, { Component } from 'react'
import { List, Icon, Image } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

// TODO: Get this from the store
const GATEWAY = 'http://127.0.0.1:5052'
const DEFAULT_AVATAR = 'https://react.semantic-ui.com/images/wireframe/square-image.png'

@inject('store') @observer
class PeerMenu extends Component {
  render () {
    const { store } = this.props
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
            {store.currentContacts.map((peer, index) => this.renderItem(index, peer))}
          </List>
        </div>
      )
    }
    return null
  }
  renderItem (id, peer) {
    return (
      <List.Item
        key={id}
        name={peer.id}
        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {/* <List.Icon name='user' /> */}
        <Image avatar style={{ width: '1em', height: '1em' }}
          src={peer.avatar ? `${GATEWAY}/ipfs/${peer.avatar}/0/small/d` : DEFAULT_AVATAR} />
        <List.Content>
          {peer.name || peer.address.slice(-8)}
        </List.Content>
      </List.Item>
    )
  }
}

export default PeerMenu
