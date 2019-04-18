import React, { Component } from 'react'
import { Icon, List, Header } from 'semantic-ui-react'
import Moment from 'react-moment'

class GroupSummary extends Component {
  render () {
    const { group } = this.props
    if (group === null) {
      return null
    }
    return (
      <div>
        <Header as='h3'>{group.name}
          <Header.Subheader>
            <List divided horizontal>
              <List.Item>
                <Icon name='user' />{group.peer_count}
              </List.Item>
              <List.Item>
                <Icon name='block layout' />{group.block_count}
              </List.Item>
              <List.Item>
                <Icon name='unlock' />{group.type ? group.type.toLowerCase() : 'private'}
              </List.Item>
              <List.Item>
                <Icon name='share square' />{group.sharing ? group.sharing.toLowerCase() : 'notshared'}
              </List.Item>
              {group.head_block &&
                <List.Item>
                  <Icon name='calendar check outline' />
                  <Moment fromNow>{group.head_block.date}</Moment>
                </List.Item>
              }
            </List>
          </Header.Subheader>
        </Header>
      </div>
    )
  }
}

export default GroupSummary
