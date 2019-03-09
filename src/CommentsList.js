import React, { Component } from 'react'
import { Comment, Header } from 'semantic-ui-react'
import Moment from 'react-moment'

class CommentsList extends Component {
  render () {
    const { comments } = this.props
    return (
      <Comment.Group>
        <Header as='h3' dividing>
          Comments
        </Header>
        {comments && comments
          .slice()
          .reverse()
          .map(comment => this.renderItem(comment))}
        <div style={{ height: '1em' }} ref={el => { this.target = el }} />
      </Comment.Group>
    )
  }
  renderItem (comment) {
    return (
      <Comment key={comment.id}>
        <Comment.Avatar src={comment.avatar} />
        <Comment.Content>
          <Comment.Author as='span'>{comment.name}</Comment.Author>
          <Comment.Metadata>
            <Moment fromNow>{comment.date}</Moment>
          </Comment.Metadata>
          <Comment.Text>
            {comment.body}
          </Comment.Text>
          <Comment.Actions>
            Reply
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    )
  }
}

export default CommentsList
