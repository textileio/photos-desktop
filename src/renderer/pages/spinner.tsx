import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import { RouteComponentProps } from '@reach/router'

const Spinner = (_props: RouteComponentProps) => (
  <Dimmer inverted active>
    <Loader size="massive" />
  </Dimmer>
)

export default Spinner
