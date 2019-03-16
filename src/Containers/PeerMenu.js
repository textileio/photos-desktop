import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class PeerMenu extends Component {
  render () {
    return (
      <Menu.Item>
        <span>peers</span>
        <Menu.Menu>
          {[{ name: 'new-avatar' }, { name: 'friend' }, { name: 'peer' }]
            .map((group, index) => this.renderItem(index, group))}
        </Menu.Menu>
      </Menu.Item>
    )
  }
  renderItem (id, group) {
    // const { store } = this.props
    return (
      <Menu.Item
        style={{ marginLeft: '1em' }}
        key={id + 'blah'}
        name={group.id + 'blah'}
        // onClick={() => { store.currentGroupId = id }}
        // active={id === store.currentGroupId}
      >
        <Menu.Header as='h4'>{group.name}</Menu.Header>
      </Menu.Item>
    )
  }
}

export default PeerMenu
