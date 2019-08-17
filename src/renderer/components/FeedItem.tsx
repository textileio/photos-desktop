import React, { SyntheticEvent } from 'react'
import { Feed, Icon, Button } from 'semantic-ui-react'
import Moment from 'react-moment'
import { observer } from 'mobx-react'
import LazyImage from './LazyImage'
import * as squareImage from '../assets/square-image.png'
import { ConnectedComponent, connect } from './ConnectedComponent'
import { Stores, FeedEvent } from '../stores'
import { clipboard } from 'electron'
import URL from 'url-parse'

export interface FeedItemProps {
  index: number
  item: FeedEvent
  onImageClick: (event: SyntheticEvent) => void
}

interface FeedItemState {
  isHovering: boolean
}

@connect('store')
@observer
class FeedItem extends ConnectedComponent<FeedItemProps, Stores, FeedItemState> {
  state = {
    isHovering: false,
  }
  handleMouseEnter = () => {
    this.setState({
      isHovering: true,
    })
  }
  handleMouseLeave = () => {
    this.setState({
      isHovering: false,
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
  onCopyLink = (item: FeedEvent) => {
    if (item.extraImages) {
      const url = new URL((item.extraImages as string[])[0])
      url.set('hostname', 'gateway.textile.cafe')
      url.set('port', undefined)
      url.set('protocol', 'https')
      clipboard.writeText(url.toString())
    }
  }
  render() {
    const { index, item, onImageClick } = this.props
    const commented = item.comments && item.comments.length > 0
    const { isHovering } = this.state
    const { store } = this.stores
    return (
      <Feed.Event
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        id={item.id}
        style={{ flex: '0 0 auto' }}
      >
        <Feed.Label>
          {item.user && (
            <LazyImage
              avatar
              src={item.user.avatar ? `${store.gateway}/ipfs/${item.user.avatar}/0/small/content` : squareImage}
            />
          )}
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary style={{ fontWeight: 'normal' }}>
            <Feed.User as="span">{item.user ? item.user.name : ''}</Feed.User>
            {item.summary &&
              (item.target ? (
                <a href={item.target}> {item.summary}</a>
              ) : (
                <span style={{ color: 'gray' }}> {item.summary}</span>
              ))}
            <Feed.Date>
              <Moment fromNow>{item.date}</Moment>
            </Feed.Date>
            {isHovering && (
              <Feed.Like>
                <Button.Group compact basic floated="right">
                  {item.likes !== undefined && (
                    <Button
                      icon={{ name: 'heart outline' }}
                      onClick={() => this.onLikesClick(item)}
                      title="Like item"
                    />
                  )}
                  {item.comments !== undefined && (
                    <Button
                      icon={{ name: 'comment outline' }}
                      onClick={() => this.onCommentsClick(index)}
                      title="Comment on item"
                    />
                  )}
                  {item.extraImages && (
                    <Button icon={{ name: 'linkify' }} onClick={() => this.onCopyLink(item)} title="Copy link" />
                  )}
                  {item.removable && (
                    <Button icon={{ name: 'delete' }} onClick={() => this.onIgnoreClick(item)} title="Remove item" />
                  )}
                </Button.Group>
              </Feed.Like>
            )}
          </Feed.Summary>
          {item.extraText && <Feed.Extra text>{item.extraText}</Feed.Extra>}
          {item.extraImages && (
            <Feed.Extra images>
              {(item.extraImages as string[]).map((img: string, i: number) => {
                return <LazyImage size={store.imageSize} key={i} as="a" onClick={onImageClick} src={img} />
              })}
            </Feed.Extra>
          )}
          <Feed.Meta>
            {item.likes !== undefined && (
              <Feed.Like onClick={() => this.onLikesClick(item)}>
                <Icon name="heart outline" />
                {item.likes.length > 0 && item.likes.length}
              </Feed.Like>
            )}
            {item.comments !== undefined && (
              <Feed.Like onClick={() => this.onCommentsClick(index)}>
                <Icon color={commented ? 'grey' : undefined} name={commented ? 'comment' : 'comment outline'} />
                {item.comments.length > 0 && item.comments.length}
              </Feed.Like>
            )}
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  }
}

export default FeedItem
