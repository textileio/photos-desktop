import React, { Component, SyntheticEvent } from 'react'
import { Feed, Icon, SemanticSIZES } from 'semantic-ui-react'
import Moment from 'react-moment'
import { FeedEvent } from '../Store'
import LazyImage from './LazyImage'
import * as squareImage from '../Assets/square-image.png'

// TODO: Get this from the store
const GATEWAY = 'http://127.0.0.1:5050'

export interface FeedItemProps {
  index: number
  item: FeedEvent
  imageSize: SemanticSIZES
  onImageClick: (event: SyntheticEvent) => void
  onCommentsClick: (index: number) => void
  onLikesClick: (item: FeedEvent) => void
}

class FeedItem extends Component<FeedItemProps> {
  render() {
    const { index, item, imageSize, onImageClick, onCommentsClick, onLikesClick } = this.props
    const commented = item.comments && item.comments.length > 0
    return (
      <Feed.Event id={item.id} style={{ flex: '0 0 auto' }}>
        <Feed.Label>
          {item.user &&
            <LazyImage avatar
              src={item.user.avatar ? `${GATEWAY}/ipfs/${item.user.avatar}/0/small/d` : squareImage}
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
                return <LazyImage size={imageSize} key={i} as='a' onClick={onImageClick} src={img} />
              })}
            </Feed.Extra>
          }
          <Feed.Meta>
            {item.likes !== undefined &&
              <Feed.Like onClick={() => onLikesClick(item)}>
                <Icon name='heart outline' />
                {item.likes.length > 0 && item.likes.length}
              </Feed.Like>
            }
            {item.comments !== undefined &&
            <Feed.Like onClick={() => onCommentsClick(index)}>
              <Icon
                color={commented ? 'grey' : undefined}
                name={commented ? 'comment' : 'comment outline'}
              />
              {item.comments.length > 0 && item.comments.length}
            </Feed.Like>
            }
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  }
}

export default FeedItem
