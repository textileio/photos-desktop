import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const WithLoadingIndicator = Component => {
  return ({ isLoading, ...props }) => {
    if (!isLoading) {
      return <Component {...props} />
    }
    return (
      <Dimmer inverted active={isLoading}>
        <Loader size='massive' />
      </Dimmer>
    )
  }
}

export default WithLoadingIndicator
