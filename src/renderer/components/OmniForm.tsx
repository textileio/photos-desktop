import React, { Component, SyntheticEvent, createRef, FormEvent } from 'react'
import FileModal from './FileModal'
import { Form, Button, Input, Icon, FormProps, Ref, InputOnChangeData } from 'semantic-ui-react'

export interface OmniFormState {
  modalOpen?: boolean
  message?: string
  file?: File
  url?: string
}

interface OmniFormProps {
  images: boolean
  onSubmit: (data: OmniFormState) => void
}

class OmniForm extends Component<OmniFormProps, OmniFormState> {
  state = {
    modalOpen: false,
    message: '',
    file: undefined,
    url: '',
  }
  private fileUploader = createRef<HTMLInputElement>()
  handleFile = (event: SyntheticEvent) => {
    event.preventDefault()
    const target = event.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]
    if (file.type.match('application/zip') || file.type.match('application/x-zip-compressed')) {
      this.setState({ file })
      this.handleCaption('Facebook import')
      return
    }
    this.setState({ file, url: URL.createObjectURL(file), modalOpen: true })
    target.value = ''
  }
  handleSubmit = (_: FormEvent<HTMLFormElement>, _data: FormProps) => {
    this.props.onSubmit({ ...this.state })
    this.handleClose()
  }
  handleCaption = (message: string) => {
    this.props.onSubmit({ ...this.state, message })
    this.handleClose()
  }
  handleChange = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    this.setState({ [data.name]: data.value })
  }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => {
    URL.revokeObjectURL(this.state.url)
    this.setState({
      message: '',
      file: undefined,
      modalOpen: false,
      url: '',
    })
  }
  render() {
    const { images } = this.props
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Input
            fluid
            icon={
              images && (
                <Icon
                  link
                  size="large"
                  style={{ width: '2em' }}
                  name="image outline"
                  onClick={() => {
                    if (this.fileUploader.current) {
                      this.fileUploader.current.click()
                    }
                  }}
                />
              )
            }
            iconPosition={images ? 'left' : undefined}
            placeholder="Say something..."
            label={<Button basic icon="send" type="submit" style={{ borderRadius: '0 0.2em 0.2em 0' }} />}
            labelPosition="right"
            name="message"
            value={this.state.message}
            onChange={this.handleChange}
          />
          <Ref innerRef={this.fileUploader}>
            <input type="file" id="file" style={{ display: 'none' }} onChange={this.handleFile} />
          </Ref>
        </Form>
        <FileModal
          onClose={this.handleClose}
          onSubmit={this.handleCaption}
          open={this.state.modalOpen}
          preview={this.state.url}
        />
      </div>
    )
  }
}

export default OmniForm
