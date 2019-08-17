import React from 'react'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'
import { Header, Grid } from 'semantic-ui-react'
import Login, { LoginState } from '../components/login'
import { RouteComponentProps } from '@reach/router'
import BackArrow from '../components/back-arrow'

@connect('store')
@observer
export default class Automatic extends ConnectedComponent<RouteComponentProps, Stores> {
  handleLogin = (data: LoginState) => {
    this.stores.store.initAndStartTextile(undefined, data.password, data.name)
  }
  render() {
    return (
      <Grid textAlign="center" centered divided style={{ height: '100vh' }}>
        <Grid.Row>
          <Grid.Column width={8} verticalAlign="middle">
            <Header as="h3">
              Create account
              <Header.Subheader>
                Choose a username and password to backup your account passphrase and protect your local data.
              </Header.Subheader>
            </Header>
            <Login signup name password onLogin={this.handleLogin} />
          </Grid.Column>
        </Grid.Row>
        <BackArrow />
      </Grid>
    )
  }
}
