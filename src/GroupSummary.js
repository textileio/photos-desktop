import React, { Component } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import Moment from 'react-moment'

@inject('store') @observer
class GroupSummary extends Component {
  render () {
    const { currentGroup } = this.props.store
    if (currentGroup === null) {
      return null
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Header as='h2'>{currentGroup.name}</Header>
        <List bulleted horizontal style={{ color: 'gray', fontSize: '0.8em' }}>
          <List.Item>
            <Icon name='user' />{currentGroup.peer_count}
          </List.Item>
          <List.Item>
            <Icon name='block layout' />{currentGroup.block_count}
          </List.Item>
          <List.Item>
            <Icon name='unlock' />{currentGroup.type ? currentGroup.type.toLowerCase() : 'private'}
          </List.Item>
          <List.Item>
            <Icon name='share square' />{currentGroup.sharing ? currentGroup.sharing.toLowerCase() : 'notshared'}
          </List.Item>
          <List.Item>
            <Icon name='users' /> {currentGroup.members.length}
          </List.Item>
          {currentGroup.head_block &&
            <List.Item>
              <Icon name='calendar check outline' />
              <Moment fromNow>{currentGroup.head_block.date}</Moment>
            </List.Item>
          }
        </List>
      </div>
    )
  }
}

export default GroupSummary
