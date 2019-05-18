import React from 'react'
import { Sidebar, Segment, Button, Icon } from 'semantic-ui-react'
import CommentsList from './CommentsList'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../Components/ConnectedComponent'
import { Stores } from '../Store'

@connect('store') @observer
class InfoSidebar extends ConnectedComponent<{}, Stores> {
  handleSidebarHide = () => {
    this.stores.store.currentItemId = undefined
  }
  render() {
    const { store } = this.stores
    return (
      <Sidebar
        as={Segment}
        animation='overlay'
        width='wide'
        direction='right'
        onHide={this.handleSidebarHide}
        visible={store.currentItemId !== undefined}
      >
        <div style={{ width: '100%', textAlign: 'right' }}>
          <Icon link name='close' onClick={this.handleSidebarHide} />
        </div>
        <CommentsList />
      </Sidebar>
    )
  }
}

export default InfoSidebar
