import React, { Component } from 'react'
import { Comment, Header } from 'semantic-ui-react'
import OmniForm from './OmniForm'
import Moment from 'react-moment'

// TODO: Get this from the store
const GATEWAY = 'http://127.0.0.1:5052'

class CommentsList extends Component {
  render () {
    const { item } = this.props
    return (
      <div>
        <Header as='h3' dividing>comments</Header>
        <Comment.Group>
          {item && item.comments && item.comments.map(item => this.renderItem(item))}
        </Comment.Group>
        <OmniForm onSubmit={this.props.onSubmit} />
      </div>
    )
  }
  renderItem (item) {
    return (
      <Comment key={item.id}>
        <Comment.Avatar src={`${GATEWAY}/ipfs/${item.user.avatar}/0/small/d`} />
        <Comment.Content>
          {!item.user.skip &&
          <div>
            <Comment.Author as='span'>{item.user.name}</Comment.Author>
            <Comment.Metadata>
              <Moment fromNow>{item.date}</Moment>
            </Comment.Metadata>
          </div>
          }
          <Comment.Text>{item.body}</Comment.Text>
        </Comment.Content>
      </Comment>
    )
  }
}

export default CommentsList
