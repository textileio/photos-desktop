import React, { FormEvent, Component } from 'react'
import { Modal, Form, Button, Image, TextArea, TextAreaProps, ModalProps } from 'semantic-ui-react'

class FileModal extends Component<ModalProps> {
  state = {
    caption: '',
  }
  handleSubmit = () => {
    this.props.onSubmit(this.state.caption)
  }
  handleChange = (_: FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
    this.setState({ [data.name]: data.value })
  }
  render() {
    const { caption } = this.state
    const { preview, open, onClose } = this.props
    return (
      <Modal open={open} closeIcon={{ name: 'close', color: 'black' }} dimmer="inverted" onClose={onClose} size="tiny">
        <Modal.Header>Add a file</Modal.Header>
        <Modal.Content image>
          <Image wrapped size="medium" src={preview} />
          <Modal.Description>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <TextArea
                  autoFocus
                  name="caption"
                  label="Caption"
                  value={caption}
                  placeholder="Add a caption..."
                  onChange={this.handleChange}
                />
                <Button>Add</Button>
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default FileModal
