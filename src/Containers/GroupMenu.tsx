import React from 'react'
import { List, Icon } from 'semantic-ui-react'
import { observer } from 'mobx-react'
import { Thread } from '@textile/js-http-client'
import { ConnectedComponent, connect } from '../Components/ConnectedComponent'
import { Stores } from '../Store'

@connect('store') @observer
class GroupMenu extends ConnectedComponent<{}, Stores> {
  render() {
    const { store } = this.stores
    return (
      <div>
        <List>
          <List.Item>
            GROUPS
            <List.Content floated='right'>
              <Icon disabled name='add' />
            </List.Content>
          </List.Item>
        </List>
        <List selection animated verticalAlign='middle'>
          {store.groups && store.groups.items.map((group, index) => this.renderItem(index, group))}
        </List>
      </div>
    )
  }
  renderItem(id: number, group: Thread) {
    const { store } = this.stores
    return (
      <List.Item key={group.id} name={group.id}
        onClick={() => { store.currentGroupId = id }}
        active={id === store.currentGroupId}
      >
        <List.Icon name='hashtag' />
        <List.Content>
          {group.name}
        </List.Content>
      </List.Item>
    )
  }
}

export default GroupMenu
