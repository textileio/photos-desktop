import React from 'react'
import { Header, Grid, Image } from 'semantic-ui-react'
import { RouteComponentProps } from '@reach/router'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'
import friends from '../assets/friends@3x.png'
import permissions from '../assets/permissions@3x.png'
import notifications from '../assets/notifications@3x.png'

@connect('store')
@observer
export default class Welcome extends ConnectedComponent<RouteComponentProps, Stores> {
  handleAutomatic = () => this.props.navigate && this.props.navigate('/automatic')
  handleSignin = () => this.props.navigate && this.props.navigate('/signin')
  handleManual = () => this.props.navigate && this.props.navigate('/manual')
  render() {
    return (
      <Grid textAlign="center" centered style={{ height: '100vh' }}>
        <Grid.Row>
          <Grid.Column width={12} verticalAlign="middle">
            <Header as="h2">
              Welcome to Textile
              <Header.Subheader>How do you want to get started?</Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center" width={4} style={{ cursor: 'pointer' }} onClick={this.handleAutomatic}>
            <Header as="h3">
              Automatic
              <Header.Subheader>New account, default security</Header.Subheader>
            </Header>
            <Image centered size="small" src={permissions} />
          </Grid.Column>
          <Grid.Column textAlign="center" width={4} style={{ cursor: 'pointer' }} onClick={this.handleSignin}>
            <Header as="h3">
              Sign in
              <Header.Subheader>Existing account, default security</Header.Subheader>
            </Header>
            <Image centered size="small" src={friends} />
          </Grid.Column>
          <Grid.Column textAlign="center" width={4}>
            <Header disabled as="h3">
              Manual
              <Header.Subheader>New account, manual security</Header.Subheader>
            </Header>
            <Image centered size="small" disabled src={notifications} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
