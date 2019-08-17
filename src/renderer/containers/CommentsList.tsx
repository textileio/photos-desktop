import React from 'react'
import { observer } from 'mobx-react'
import { Comment, Header } from 'semantic-ui-react'
import OmniForm, { OmniFormState } from '../components/OmniForm'
import Moment from 'react-moment'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'
import squareImage from '../assets/square-image.png'

@connect('store')
@observer
class CommentsList extends ConnectedComponent<{}, Stores> {
  handleMessage = (data: OmniFormState) => {
    if (data.message) {
      this.stores.store.addComment(this.stores.store.currentItem.id, data.message)
    }
  }
  render() {
    const { currentItem } = this.stores.store
    if (!currentItem) {
      // tslint:disable-next-line:no-null-keyword
      return null
    }
    return (
      <div>
        <Header as="h3" dividing>
          comments
        </Header>
        <Comment.Group>
          {currentItem.comments && currentItem.comments.map((item: any) => this.renderItem(item))}
        </Comment.Group>
        <OmniForm images={false} onSubmit={this.handleMessage} />
      </div>
    )
  }
  renderItem(item: any) {
    return (
      <Comment key={item.id}>
        <Comment.Avatar
          src={item.user.avatar ? `${this.stores.store.gateway}/ipfs/${item.user.avatar}/0/small/content` : squareImage}
        />
        <Comment.Content>
          <Comment.Author as="span">{item.user.name}</Comment.Author>
          <Comment.Metadata>
            <Moment fromNow>{item.date}</Moment>
          </Comment.Metadata>
          <Comment.Text>{item.body}</Comment.Text>
        </Comment.Content>
      </Comment>
    )
  }
}

export default CommentsList
