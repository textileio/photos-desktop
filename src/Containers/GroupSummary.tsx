import React, { SyntheticEvent } from 'react'
import { Icon, List, Header, Confirm, Button, Dropdown, Modal } from 'semantic-ui-react'
import Moment from 'react-moment'
import { ConnectedComponent, connect } from '../Components/ConnectedComponent'
import { Stores } from '../Store'
import { observer } from 'mobx-react'
import { toast } from 'react-semantic-toasts'

const DEFAULT_AVATAR = 'https://react.semantic-ui.com/images/wireframe/square-image.png'

interface GroupState {
  leaveOpen: boolean
  // inviteOpen: boolean
  addresses: string[]
}

@connect('store') @observer
class GroupSummary extends ConnectedComponent<{}, Stores, GroupState> {
  state = {
    leaveOpen: false,
    // inviteOpen: false,
    addresses: []
  }
  handleLeaveOpen = () => {
    this.setState({ leaveOpen: true })
  }
  handleInviteOpen = () => {
    // this.setState({ inviteOpen: true })
    this.stores.store.openInviteModal = true
  }
  handleInviteClose = () => {
    // this.setState({ inviteOpen: false, addresses: [] })
    this.stores.store.openInviteModal = false
    this.setState({ addresses: [] })
  }
  handleLeaveCancel = () => {
    this.setState({ leaveOpen: false })
  }
  handleLeaveConfirm = () => {
    this.handleLeaveCancel()
    const { store } = this.stores
    if (store.currentGroup) {
      store.leaveGroup(store.currentGroup.id)
    }
  }
  handleInputChange = (_: SyntheticEvent, data: any) => {
    this.setState({ addresses: data.value })
  }
  handleInviteConfirm = () => {
    const { store } = this.stores
    for (const address of this.state.addresses) {
      if (store.currentGroup) {
        store.addInvite(store.currentGroup.id, address)
      }
    }
    this.handleInviteClose()
    toast({
      icon: 'smile outline',
      title: 'Invite(s) sent',
      description: 'Your direct peer-to-peer invite is on the way!',
      time: 3000
    })
  }
  handleInviteLink = () => {
    const { store } = this.stores
    if (store.currentGroup) {
      store.addInvite(store.currentGroup.id)
    }
  }
  handleAddContact = (_: SyntheticEvent, data: any) => {
    this.setState({
      addresses: data.value
    })
  }
  render() {
    const { store } = this.stores
    const { currentGroup, contacts } = store
    if (!currentGroup) {
      // tslint:disable-next-line:no-null-keyword
      return null
    }
    const options = contacts ? contacts.items.map((item) => {
      return {
        key: item.address,
        text: item.name,
        value: item.address,
        image: {
          avatar: true,
          src: item.avatar ? `${store.gateway}/ipfs/${item.avatar}/0/small/content` : DEFAULT_AVATAR
        }
      }
    }) : []
    return (
      <div>
        <Header as='h3' style={{ fontFamily: 'Biotif' }}>
          {currentGroup.name}
          <Header.Subheader>
            <List divided horizontal>
              <List.Item>
                <Icon name='user' />{currentGroup.peer_count}
              </List.Item>
              <List.Item>
                <Icon name='block layout' />{currentGroup.block_count}
              </List.Item>
              <List.Item>
                <Icon name='unlock' />{currentGroup.type ? currentGroup.type.toLowerCase() : 'private'}
              </List.Item>
              <List.Item>
                <Icon name='share square' />{currentGroup.sharing ? currentGroup.sharing.toLowerCase() : 'notshared'}
              </List.Item>
              {currentGroup.head_block &&
                <List.Item>
                  <Icon name='calendar check outline' />
                  <Moment fromNow>{currentGroup.head_block.date}</Moment>
                </List.Item>
              }
              <List.Item>
                <Dropdown item icon={{ name: 'setting' }}>
                  <Dropdown.Menu>
                    <Modal closeIcon size='small' trigger={
                      <Dropdown.Item icon='share square' text='Invite' onClick={this.handleInviteOpen} />
                      }
                      open={store.openInviteModal}
                      onClose={this.handleInviteClose}
                    >
                    <Modal.Header>
                      Invite contacts
                    </Modal.Header>
                      <Modal.Content>
                        <Dropdown onChange={this.handleAddContact} placeholder='Select contacts...' fluid multiple selection options={options} />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button icon='external' content='Copy link' type='button' onClick={this.handleInviteLink} />
                        <Button icon='send' content='Invite' type='submit' primary onClick={this.handleInviteConfirm} />
                      </Modal.Actions>
                    </Modal>
                    <Dropdown.Item icon='delete' text='Leave' onClick={this.handleLeaveOpen} />
                  </Dropdown.Menu>
                </Dropdown>
              </List.Item>
            </List>
          </Header.Subheader>
        </Header>
        <Confirm
          open={this.state.leaveOpen}
          size='small'
          confirmButton='Leave'
          header='Leave group?'
          content={`Are you sure you want to leave the '${currentGroup.name}' group?`}
          onCancel={this.handleLeaveCancel}
          onConfirm={this.handleLeaveConfirm}
        />
      </div>
    )
  }
}

export default GroupSummary
