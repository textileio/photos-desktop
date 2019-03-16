import React, { Component } from 'react'
import { Feed, Segment, Message, Modal } from 'semantic-ui-react'
import LazyImage from '../Components/LazyImage'
import FeedItem from '../Components/FeedItem'
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class FeedView extends Component {
  state = {
    modalOpen: false,
    src: undefined
  }
  handleModalOpen = event => {
    this.setState({ modalOpen: true, src: event.target.src })
  }
  handleModalClose = () => this.setState({ modalOpen: false, src: undefined })
  componentDidUpdate () {
    this.scrollToBottom()
  }
  scrollToBottom () {
    if (this.target) {
      this.target.scrollIntoView(false)
    }
  }
  render () {
    const { store } = this.props
    if (store.currentGroup && store.currentGroup.feed && store.currentGroup.feed.length) {
      return (
        <Segment basic>
          <Feed style={{ display: 'flex', flexDirection: 'column-reverse' }}>
            {store.currentGroup.feed
              .map(item => {
                return <FeedItem
                  key={item.id}
                  item={item}
                  imageSize={store.imageSize}
                  onImageClick={this.handleModalOpen}
                  onCommentsClick={item => store.setCurrentItem(item)}
                  onLikesClick={item => store.addLike(item.id)}
                />
              })}
          </Feed>
          <div ref={(el) => { this.target = el }} />
          <Modal
            open={this.state.modalOpen}
            onClose={this.handleModalClose}
            dimmer='blurring'
            basic
            content={
              <LazyImage style={{ maxHeight: '90vh' }} centered src={this.state.src} />
            }
          />
        </Segment>
      )
    }
    return (
      <div>
        <Message
          icon='eye'
          header='Nothing to see here, yet!'
          content='Maybe its time to add some content?'
        />
      </div>
    )
  }
}

export default FeedView
