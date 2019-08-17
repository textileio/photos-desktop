import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'
import { Header, Grid, Form, Input, InputOnChangeData } from 'semantic-ui-react'
import Login, { LoginState } from '../components/login'
import { RouteComponentProps } from '@reach/router'
import BackArrow from '../components/back-arrow'

interface SigninState {
  seed: string
}

@connect('store')
@observer
export default class Signin extends ConnectedComponent<RouteComponentProps, Stores, SigninState> {
  state = {
    seed: '',
  }
  handleLogin = (data: LoginState) => {
    this.stores.store.initAndStartTextile(this.state.seed, data.password)
  }
  handleSeedChange = (_event: FormEvent, data: InputOnChangeData) => {
    if (data.name === 'seed') {
      this.setState({ seed: data.value as string })
    }
  }
  render() {
    return (
      <Grid textAlign="center" centered divided style={{ height: '100vh' }}>
        <Grid.Row>
          <Grid.Column width={8} verticalAlign="middle">
            <Header as="h3">
              Sign in
              <Header.Subheader>Enter your existing account seed here.</Header.Subheader>
            </Header>
            <Form>
              <Form.Field
                title="Input existing account seed (should be at least 48 chars)"
                required
                error={!!this.state.seed && this.state.seed.length < 48}
              >
                <Input
                  name="seed"
                  type="input"
                  placeholder="Seed..."
                  value={this.state.seed || ''}
                  onChange={this.handleSeedChange}
                  icon="lock"
                />
              </Form.Field>
            </Form>
            <p style={{ marginTop: '0.5em' }}>Optionally, choose a password to protect your local data.</p>
            <Login signup={false} password onLogin={this.handleLogin} disabled={this.state.seed.length < 48} />
          </Grid.Column>
        </Grid.Row>
        <BackArrow />
      </Grid>
    )
  }
}
