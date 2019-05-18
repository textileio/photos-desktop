import React, { SyntheticEvent } from 'react'
import { Feed, Icon } from 'semantic-ui-react'
import Moment from 'react-moment'
import { observer } from 'mobx-react'
import LazyImage from './LazyImage'
import * as squareImage from '../Assets/square-image.png'
import { ConnectedComponent, connect } from '../Components/ConnectedComponent'
import { Stores, FeedEvent } from '../Store'

export interface FeedItemProps {
  index: number
  item: FeedEvent
  onImageClick: (event: SyntheticEvent) => void
}

interface FeedItemState {
  isHovering: boolean
}

@connect('store') @observer
class FeedItem extends ConnectedComponent<FeedItemProps, Stores, FeedItemState> {
  state = {
    isHovering: false
  }
  handleMouseHover = () => {
    this.setState({
      isHovering: !this.state.isHovering
    })
  }
  onCommentsClick = (id: number) => {
    this.stores.store.currentItemId = id
  }
  onLikesClick = (item: FeedEvent) => {
    this.stores.store.addLike(item.id)
  }
  onIgnoreClick = (item: FeedEvent) => {
    this.stores.store.ignoreItem(item.id)
  }
  render() {
    const { index, item, onImageClick } = this.props
    const commented = item.comments && item.comments.length > 0
    const { isHovering } = this.state
    const { store } = this.stores
    return (
      <Feed.Event
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
        id={item.id} style={{ flex: '0 0 auto' }}>
        <Feed.Label>
          {item.user &&
            <LazyImage avatar
              src={item.user.avatar ? `${store.gateway}/ipfs/${item.user.avatar}/0/small/content` : squareImage}
            />}
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary style={{ fontWeight: 'normal' }}>
            <Feed.User as='span'>{item.user ? item.user.name : ''}</Feed.User>
            {item.summary &&
              (item.target
                ? <a href={item.target}> {item.summary}</a>
                : <span style={{ color: 'gray' }}> {item.summary}</span>
              )}
              <Feed.Date>
                <Moment fromNow>{item.date}</Moment>
              </Feed.Date>
          </Feed.Summary>
          {item.extraText &&
            <Feed.Extra text>{item.extraText}</Feed.Extra>
          }
          {item.extraImages &&
            <Feed.Extra images>
              {(item.extraImages as string[]).map((img: string, i: number) => {
                return <LazyImage size={store.imageSize} key={i} as='a' onClick={onImageClick} src={img} />
              })}
            </Feed.Extra>
          }
          <Feed.Meta>
            {item.likes !== undefined &&
              <Feed.Like onClick={() => this.onLikesClick(item)}>
                <Icon name='heart outline' />
                {item.likes.length > 0 && item.likes.length}
              </Feed.Like>
            }
            {item.comments !== undefined &&
            <Feed.Like onClick={() => this.onCommentsClick(index)}>
              <Icon
                color={commented ? 'grey' : undefined}
                name={commented ? 'comment' : 'comment outline'}
              />
              {item.comments.length > 0 && item.comments.length}
            </Feed.Like>
            }
            {isHovering && item.removable &&
              <Feed.Like onClick={() => this.onIgnoreClick(item)}>
                <Icon name='delete' color='grey' title='Remove item'/>
              </Feed.Like>
            }
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  }
}

export default FeedItem
