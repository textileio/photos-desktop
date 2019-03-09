import React, { Component } from 'react'
import { Menu, Header, Icon, Modal, Form, Button, Message } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class GroupList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false,
      name: ''
    }
  }
  showModal = () => this.setState({ showModal: true })
  closeModal = () => this.setState({ showModal: false, name: '' })
  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleSubmit = () => {
    this.props.store.createGroup(this.state.name)
    this.closeModal()
  }
  render () {
    const { store } = this.props
    const { name, showModal } = this.state
    return (
      <Menu vertical tabular compact style={{ textAlign: 'right' }}>
        <Header style={{ marginTop: '1em', textAlign: 'center' }} as='h3'>
          Groups
        </Header>
        {store.groups && store.groups
          .map((group, index) => this.renderItem(index, group))}
        <Menu.Item>
          <Modal
            onClose={this.closeModal}
            open={showModal}
            centered={false}
            closeIcon={{ name: 'close', color: 'black' }}
            dimmer='inverted'
            size='tiny'
            trigger={
              <Icon
                bordered
                circular
                link
                name='plus'
                onClick={this.showModal}
              />
            }
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
        </Menu.Item>
      </Menu>
    )
  }
  renderItem (id, group) {
    const { store } = this.props
    return (
      <Menu.Item
        key={id}
        name={group.id}
        onClick={() => {
          store.currentGroupId = id
        }}
        active={id === store.currentGroupId}
      >
        <Header as='h3' style={{ margin: 0 }}>{group.name}</Header>
      </Menu.Item>
    )
  }
}

export default GroupList
