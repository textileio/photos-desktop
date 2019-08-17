import React, { SyntheticEvent } from 'react'
import { List, Icon, Modal, Form, Button } from 'semantic-ui-react'
import { observer } from 'mobx-react'
import { Thread } from '@textile/js-http-client'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'

interface AddGroupState {
  name: string
  modalOpen: boolean
}

@connect('store')
@observer
class GroupMenu extends ConnectedComponent<{}, Stores, AddGroupState> {
  state = {
    name: '',
    modalOpen: false,
  }
  handleNameChange = (_: SyntheticEvent, data: any) => {
    this.setState({ name: data.value })
  }
  handleFormSubmit = () => {
    const { store } = this.stores
    if (this.state.name === '') {
      return
    }
    store.createGroup(this.state.name)
    this.handleModalClose()
  }
  handleModalOpen = () => {
    this.setState({ modalOpen: true })
  }
  handleModalClose = () => {
    this.setState({
      modalOpen: false,
      name: '',
    })
  }
  render() {
    const { store } = this.stores
    const { name } = this.state
    return (
      <div>
        <List>
          <List.Item>
            GROUPS
            <List.Content floated="right">
              <Modal
                open={this.state.modalOpen}
                size="small"
                onClose={this.handleModalClose}
                trigger={<Icon link name="add" onClick={this.handleModalOpen} />}
              >
                <Modal.Header>New Group</Modal.Header>
                <Modal.Content>
                  <Form id="form" onSubmit={this.handleFormSubmit}>
                    <Form.Input
                      required
                      placeholder="Add title..."
                      name="name"
                      value={name}
                      onChange={this.handleNameChange}
                      autoFocus
                    />
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                  <Button content="Cancel" type="reset" onClick={this.handleModalClose} />
                  <Button content="Submit" type="submit" primary form="form" />
                </Modal.Actions>
              </Modal>
            </List.Content>
          </List.Item>
        </List>
        <List selection animated verticalAlign="middle">
          {store.groups && store.groups.items.map((group, index) => this.renderItem(index, group))}
        </List>
      </div>
    )
  }
  renderItem(id: number, group: Thread) {
    const { store } = this.stores
    return (
      <List.Item
        key={group.id}
        name={group.id}
        onClick={() => {
          store.currentGroupId = id
        }}
        active={id === store.currentGroupId}
      >
        <List.Icon name="hashtag" />
        <List.Content>{group.name}</List.Content>
      </List.Item>
    )
  }
}

export default GroupMenu
