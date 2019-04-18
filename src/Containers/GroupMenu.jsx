import React, { Component } from 'react'
import { List, Icon } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class GroupMenu extends Component {
  render () {
    const { store } = this.props
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
          {store.groups && store.groups.map((group, index) => this.renderItem(index, group))}
        </List>
      </div>
    )
  }
  renderItem (id, group) {
    const { store } = this.props
    return (
      <List.Item
        key={id}
        name={group.id}
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
