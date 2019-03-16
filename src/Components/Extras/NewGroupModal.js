import React, { Component } from 'react'
import { Modal, Form, Button, Message } from 'semantic-ui-react'

class NewGroupModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }
  handleSubmit = e => {
    this.props.onSubmit(this.state.name)
  }
  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  render () {
    const { name } = this.state
    return (
      <Modal {...this.props}
        closeIcon={{ name: 'close', color: 'black' }}
        dimmer='inverted'
        size='tiny'
      >
        <Modal.Header>Create new group</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={this.handleSubmit} warning={name.length < 1}>
              <Form.Field>
                <Form.Input
                  autoFocus
                  name='name'
                  label='Name'
                  value={name}
                  placeholder='Group name...'
                  onChange={this.handleChange}
                />
                <Button disabled={name.length < 1}>Create</Button>
              </Form.Field>
              <Message
                warning
                header='Name required'
                content='You must give your new group a name.'
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default NewGroupModal
