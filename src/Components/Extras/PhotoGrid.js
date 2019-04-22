import React, { Component } from 'react'
import { Grid, Modal, Image, Icon, Label, Message } from 'semantic-ui-react'
import LazyImage from './LazyImage'
import MessageList from './MessageList'
import AnimateHeight from 'react-animate-height'
import styled from 'styled-components'
import Filler from './Filler'
import { observer, inject } from 'mobx-react'

const RedHoverIcon = styled(Icon)`
color: grey;
&:hover {
  color: red;
}
`

@inject('store') @observer
class PhotoGrid extends Component {
  state = {
    height: 0
  }
  toggle = () => {
    const { height } = this.state
    this.setState({
      height: height === 0 ? 'auto' : 0
    })
  }

  render () {
    const { store } = this.props
    if (store.currentGroup) {
      return (
        <Grid container doubling relaxed columns={5}>
          {store.currentGroup.feed && store.currentGroup.feed
            .map((item, index) => this.renderItem(index, item))}
        </Grid>
      )
    }
    return <Filler body={
      <Message info compact
        header='Nothing to see here!'
        content={
          <div>
            There's nothing here yet, so go create a group using the <Icon size='small' bordered circular link name='plus' />
            icon on the left
          </div>
        }
      />
    } />
  }
  renderItem (id, { src, comments, likes }) {
    const { height } = this.state
    return (
      <Grid.Column key={id}>
        <Modal
          closeIcon={{ name: 'close', color: 'black' }}
          basic
          dimmer='inverted'
          trigger={
            <LazyImage src={src} label={
              <div>
                <Label
                  style={{ border: 'transparent' }}
                  basic
                  corner='left'
                >
                  <RedHoverIcon name='heart'
                    // TODO: Make sure we get proper info here
                    color={Math.random() > 0.5 ? 'red' : 'grey'}
                  />
                </Label>
              </div>
            } />
          }
          onClose={() => { this.setState({ height: 0 }) }}
        >
          <Modal.Content>
            <Modal.Description style={{ textAlign: 'center' }}>
              <Image centered size='large' src={src} />
              <p>{comments.length && comments[0].body}</p>
              <Icon
                size='large'
                name={`chevron ${height === 0 ? 'down' : 'up'}`}
                onClick={this.toggle} />
            </Modal.Description>
            <Modal.Description>
              <AnimateHeight
                duration={500}
                height={height}
                onAnimationEnd={height => {
                  if (height && this.scrollDiv) {
                    this.scrollDiv.scrollIntoView({
                      behavior: 'smooth'
                    })
                  }
                }}
              >
                <MessageList comments={comments} />
              </AnimateHeight>
            </Modal.Description>
            <div ref={(el) => { this.scrollDiv = el }} />
          </Modal.Content>
        </Modal>
      </Grid.Column>
    )
  }
}

export default PhotoGrid
