import React, { Component, createRef } from 'react'
import { Feed, Segment, Message, Modal, Visibility, Ref, Icon } from 'semantic-ui-react'
import LazyImage from '../Components/LazyImage'
import FeedItem from '../Components/FeedItem'
import { observer, inject } from 'mobx-react'
// import ScrollToBottom from 'react-scroll-to-bottom'
// import ReactPullToRefresh from 'react-pull-to-refresh'

@inject('store') @observer
class FeedView extends Component {
  state = {
    modalOpen: false,
    src: undefined,
    atBottom: true
  }
  handleModalOpen = event => {
    this.setState({ modalOpen: true, src: event.target.src })
  }
  handleModalClose = () => this.setState({ modalOpen: false, src: undefined })
  componentDidUpdate () {
    if (this.feedRef.current) {
      this.feedRef.current.scrollIntoView(false)
    }
  }
  handleRefresh = (e, { calculations }) => {
    this.atBottom = calculations.bottomVisible
  }
  handleMore = () => {
    const { store } = this.props
    const feed = store.currentGroup.feed
    if (this.visibilityRef.current) {
      const height = this.visibilityRef.current.clientHeight
      if (feed && feed.next) {
        store.fetchGroupData(store.currentGroupId, feed.count + 10).then(() => {
          this.visibilityRef.current.scrollTop = height * 1.5
        })
      }
    }
  }
  atBottom = true
  visibilityRef = createRef()
  feedRef = createRef()
  render () {
    const { store } = this.props
    if (store.currentGroup && store.currentGroup.feed && store.currentGroup.feed.items.length) {
      const feed = store.currentGroup.feed
      return (
        <Ref innerRef={this.visibilityRef}>
          <Segment basic style={{ overflowY: 'auto', height: 'calc(100vh - 125px)' }}>
            {feed && feed.next &&
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={this.handleMore}>
              <Icon name='arrow circle up' size='large' />
            </div>
            }
            <Visibility onUpdate={this.handleRefresh}>
              <Ref innerRef={this.feedRef}>
                <Feed style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                  {store.currentGroup.feed.items
                    .map((item, index) => {
                      return <FeedItem
                        key={item.id}
                        index={index}
                        item={item}
                        imageSize={store.imageSize}
                        onImageClick={this.handleModalOpen}
                        onCommentsClick={id => { store.currentItemId = id }}
                        onLikesClick={item => { store.addLike(item.id) }}
                      />
                    })}
                </Feed>
              </Ref>
            </Visibility>
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
        </Ref>
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
