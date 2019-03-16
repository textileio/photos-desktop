import React, { Component } from 'react'
import { Comment, Header } from 'semantic-ui-react'
import OmniForm from './OmniForm'
import Moment from 'react-moment'

class CommentsList extends Component {
  render () {
    const { item } = this.props
    return (
      <div>
        <Header as='h3' dividing>comments</Header>
        <Comment.Group style={{ display: 'flex', flexDirection: 'column-reverse' }}>
          {item && item.comments && item.comments.map(item => this.renderItem(item))}
        </Comment.Group>
        <OmniForm onSubmit={this.props.onSubmit} />
      </div>
    )
  }
  renderItem (item) {
    return (
      <Comment key={item.id}>
        <Comment.Avatar src={item.image} />
        <Comment.Content>
          <Comment.Author as='span'>{item.user.name}</Comment.Author>
          <Comment.Metadata>
            <Moment fromNow>{item.date}</Moment>
          </Comment.Metadata>
          <Comment.Text>
            {/* // TODO: This might be a js-http-client bug? */}
            {decodeURIComponent(item.body)}
          </Comment.Text>
          {/* <Comment.Actions>
            Reply
          </Comment.Actions> */}
        </Comment.Content>
      </Comment>
    )
  }
}

export default CommentsList
