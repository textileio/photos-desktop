import React, { Component } from 'react'
import FileModal from './FileModal'
import { Form, Button, Input, Icon } from 'semantic-ui-react'

class OmniForm extends Component {
  state = { modalOpen: false, message: '', file: null, url: '' }
  handleFile = e => {
    e.preventDefault()
    const file = e.target.files[0]
    this.setState({ file, url: URL.createObjectURL(file), modalOpen: true })
    e.target.value = null
  }
  handleSubmit = caption => {
    this.props.onSubmit({ ...this.state, caption })
    this.handleClose()
  }
  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => {
    URL.revokeObjectURL(this.state.url)
    this.setState({
      message: '',
      file: null,
      modalOpen: false,
      url: ''
    })
  }
  render () {
    const { images } = this.props
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Input
            fluid
            icon={images &&
              <Icon
                link
                size='large'
                style={{ width: '2em' }}
                name='image outline'
                onClick={() => { this.refs.fileUploader.click() }}
              />}
            iconPosition={images && 'left'}
            placeholder='Say something...'
            label={<Button basic as='a' icon='send' />}
            labelPosition='right'
            name='message'
            value={this.state.message}
            onChange={this.handleChange}
          />
          <input
            type='file'
            id='file'
            ref='fileUploader'
            style={{ display: 'none' }}
            onChange={this.handleFile}
          />
        </Form>
        <FileModal
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
          open={this.state.modalOpen}
          preview={this.state.url}
        />
      </div>
    )
  }
}

export default OmniForm
