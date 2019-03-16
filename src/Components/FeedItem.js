import React, { Component } from 'react'
import { Feed, Icon } from 'semantic-ui-react'
import Moment from 'react-moment'
import LazyImage from '../Components/LazyImage'

const DEFAULT_IMAGE = ''

class FeedItem extends Component {
  render () {
    const { item, imageSize, onImageClick, onCommentsClick, onLikesClick } = this.props
    const commented = item.comments && item.comments.length > 0
    return (
      <Feed.Event id={item.id}>
        <Feed.Label>
          <LazyImage avatar onError={i => { i.target.src = DEFAULT_IMAGE }} src={item.image} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary style={{ fontWeight: 'normal' }}>
            <Feed.User as='span'>{item.user.name}</Feed.User>
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
            <Feed.Extra text>
              {decodeURIComponent(item.extraText)}
            </Feed.Extra>
          }
          {item.extraImages &&
            <Feed.Extra images>
              {item.extraImages.map((img, i) => {
                return <LazyImage size={imageSize} key={i} as='a' onClick={onImageClick} src={img} />
              })}
            </Feed.Extra>
          }
          <Feed.Meta>
            <Feed.Like onClick={() => onLikesClick(item)}>
              <Icon
                color={item.liked ? 'red' : null}
                name={`heart${item.liked ? '' : ' outline'}`}
              />
              {item.likes && item.likes.length}
            </Feed.Like>
            {/* TODO: You can't comment on certain feed types */}
            <Feed.Like onClick={() => onCommentsClick(item)}>
              <Icon
                color={commented ? 'grey' : null}
                name={`comment${commented ? '' : ' outline'}`}
              />
              {item.comments && item.comments.length}
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  }
}

export default FeedItem
