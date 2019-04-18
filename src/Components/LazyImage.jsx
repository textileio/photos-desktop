import React, { Component } from 'react'
import { Visibility, Image, Loader } from 'semantic-ui-react'

// https://cmichel.io/lazy-load-images-with-react/
class LazyImage extends Component {
  state = {
    onScreen: false
  }

  handleVisible = (e, { calculations }) => {
    // TODO: Does it makes sense that once loaded, stay loaded?
    if (!this.state.onScreen) {
      this.setState(calculations)
    }
  }

  render () {
    const { size } = this.props
    const { onScreen } = this.state
    return (
      <Visibility offset={-300} fireOnMount onUpdate={this.handleVisible}>
        {onScreen
          ? <Image {...this.props} />
          : <Loader active inline='centered' size={size} />}
      </Visibility>
    )
  }
}

export default LazyImage
