import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class Filler extends Component {
  render () {
    return (
      <Segment basic>
        {this.props.body}
      </Segment>
    )
  }
}

export default Filler
