import React, { SyntheticEvent, FormEvent, ChangeEvent, Component } from 'react'
import { Button, Form, Icon, InputOnChangeData, Progress, Input } from 'semantic-ui-react'
import zxcvbn from 'zxcvbn'

type PassType = 'password' | 'input'
export interface LoginState {
  name: string
  password: string
  score?: number
  passType?: PassType
}

export interface LoginProps {
  onLogin: (data: LoginState) => void
  name?: boolean
  password?: boolean
  signup?: boolean
  disabled?: boolean
}

export default class Login extends Component<LoginProps, LoginState> {
  state = {
    name: '',
    password: '',
    score: undefined,
    passType: 'password' as PassType,
    disabled: false,
  }
  handlePassChange = (_event: ChangeEvent, data: InputOnChangeData) => {
    if (data.name === 'password') {
      this.setState({ password: data.value as string, score: zxcvbn(data.value).score })
    }
  }
  handleNameChange = (_event: FormEvent, data: InputOnChangeData) => {
    if (data.name === 'name') {
      this.setState({ name: data.value as string })
    }
  }
  handleSubmit = (_event: SyntheticEvent) => this.props.onLogin(this.state)
  togglePassType = () =>
    this.setState({
      passType: this.state.passType === 'password' ? 'input' : 'password',
    })
  render() {
    const { name, password, passType, score } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.props.name && (
          <Form.Field title="Choose a name (must be at least 6 characters)" required error={!!name && name.length < 6}>
            <Input
              name="name"
              type="input"
              placeholder="Name..."
              value={name}
              onChange={this.handleNameChange}
              icon="user"
            />
          </Form.Field>
        )}
        {this.props.password && (
          <Form.Field>
            <Input
              name="password"
              type={passType}
              placeholder="Password..."
              value={password}
              onChange={this.handlePassChange}
              icon={<Icon name={passType === 'password' ? 'eye' : 'eye slash'} link onClick={this.togglePassType} />}
            />
            <Progress attached="bottom" indicating value={score || 0} total={4} />
          </Form.Field>
        )}
        <Button
          content={this.props.signup ? 'Sign-up' : 'Sign-in'}
          icon="sign-in"
          type="submit"
          disabled={this.props.disabled}
        />
      </Form>
    )
  }
}
