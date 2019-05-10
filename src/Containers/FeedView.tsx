import React, { createRef, SyntheticEvent } from 'react'
import { Feed, Segment, Message, Modal, Visibility, Ref, Icon, VisibilityEventData } from 'semantic-ui-react'
import LazyImage from '../Components/LazyImage'
import FeedItem from '../Components/FeedItem'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../Components/ConnectedComponent'
import { Stores, FeedEvent } from '../Store'

interface FeedViewState {
  modalOpen: boolean
  src?: string
}

@connect('store') @observer
class FeedView extends ConnectedComponent<{}, Stores, FeedViewState> {
  state = {
    modalOpen: false,
    src: undefined
  }
  private shouldScroll: boolean = true
  private visibilityRef = createRef<HTMLDivElement>()
  private feedRef = createRef<HTMLDivElement>()
  handleModalOpen = (event: SyntheticEvent) => {
    const target = event.target as HTMLImageElement
    this.setState({ modalOpen: true, src: target.src })
  }
  handleModalClose = () => this.setState({ modalOpen: false, src: undefined })
  componentWillUpdate(_: {}, nextState: FeedViewState) {
    this.shouldScroll = !((!nextState.modalOpen && this.state.modalOpen) || nextState.modalOpen)
  }
  componentDidUpdate() {
    if (this.feedRef.current && this.shouldScroll) {
      this.feedRef.current.scrollIntoView(false)
      this.shouldScroll = false
    }
  }
  // handleRefresh = (_: null, data: VisibilityEventData) => {
  //   this.atBottom = data.calculations.bottomVisible
  // }
  handleMore = () => {
    const { store } = this.stores
    const feed = store.currentFeed
    if (this.visibilityRef.current && feed) {
      const height = this.visibilityRef.current.clientHeight
      if (feed.next && this.visibilityRef.current && store.currentGroupId !== undefined) {
        store.fetchGroupData(store.currentGroupId, feed.count + 10).then(() => {
          if (this.visibilityRef.current) {
            this.visibilityRef.current.scrollTop = height
          }
        })
      }
    }
  }
  render() {
    const { store } = this.stores
    if (store.currentGroup && store.currentFeed && store.currentFeed.items.length) {
      const feed = store.currentFeed
      return (
        <Ref innerRef={this.visibilityRef}>
          <Segment basic style={{ overflowY: 'auto', height: 'calc(100vh - 125px)' }}>
            {feed && feed.next &&
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={this.handleMore}>
              <Icon name='arrow circle up' size='large' />
            </div>
            }
              <Ref innerRef={this.feedRef}>
                <Feed style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                  {feed.items
                    .map((item: FeedEvent, index: number) => {
                      return <FeedItem
                        key={item.id}
                        index={index}
                        item={item}
                        imageSize={store.imageSize}
                        onImageClick={this.handleModalOpen}
                        onCommentsClick={(id) => { store.currentItemId = id }}
                        onLikesClick={(item) => { store.addLike(item.id) }}
                      />
                    })}
                </Feed>
              </Ref>
            <Modal
              open={this.state.modalOpen}
              onClose={this.handleModalClose}
              dimmer
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
