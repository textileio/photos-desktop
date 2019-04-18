import React, { Component } from 'react'
import { Sidebar, Segment } from 'semantic-ui-react'
import CommentsList from '../Components/CommentsList'
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class InfoSidebar extends Component {
  handleSidebarHide = () => {
    this.props.store.currentItemId = null
  }
  render () {
    const { store } = this.props
    return (
      <Sidebar
        as={Segment}
        animation='overlay'
        icon='labeled'
        width='wide'
        direction='right'
        onHide={this.handleSidebarHide}
        visible={store.currentItemId !== null}
      >
        <CommentsList
          item={store.currentItem}
          onSubmit={({ message }) => store.addComment(store.currentItem.id, message)}
        />
      </Sidebar>
    )
  }
}

export default InfoSidebar
