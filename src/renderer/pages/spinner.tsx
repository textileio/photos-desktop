import React from 'react'
import { Dimmer, Loader, DimmerProps } from 'semantic-ui-react'
import { RouteComponentProps } from '@reach/router'

const Spinner = (props: RouteComponentProps & DimmerProps) => (
  <Dimmer {...props} inverted>
    <Loader size="massive" />
  </Dimmer>
)

export default Spinner
