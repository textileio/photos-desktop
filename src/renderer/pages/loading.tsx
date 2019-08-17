import React, { Component } from 'react'
import { RouteComponentProps } from '@reach/router'
import { Image, Dimmer } from 'semantic-ui-react'
import Pulse from 'react-reveal/Pulse'
import Logo from '../assets/logo@3x.png'

export default class Loading extends Component<RouteComponentProps> {
  render() {
    return (
      <Dimmer inverted active>
        <Pulse forever>
          <Image centered verticalAlign="middle" size="small" src={Logo} />
        </Pulse>
      </Dimmer>
    )
  }
}
