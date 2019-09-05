import React from 'react'
import { RouteComponentProps, Redirect } from '@reach/router'
import { Image, Dimmer } from 'semantic-ui-react'
import Pulse from 'react-reveal/Pulse'
import Logo from '../assets/logo@3x.png'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'

@connect('user')
@observer
export default class Loading extends ConnectedComponent<RouteComponentProps, Stores> {
  render() {
    switch (this.stores.user.page) {
      case 'default':
      case 'loading':
        console.log(this.stores.user.page)
        return (
          <Dimmer inverted active>
            <Pulse forever>
              <Image centered verticalAlign="middle" size="small" src={Logo} />
            </Pulse>
          </Dimmer>
        )
      default:
        return <Redirect to={this.stores.user.page} />
    }
  }
}
