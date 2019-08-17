import React, { Component, SyntheticEvent } from 'react'
import { Visibility, Image, Loader, ImageProps, VisibilityEventData } from 'semantic-ui-react'
import * as squareImage from '../assets/square-image.png'

// https://cmichel.io/lazy-load-images-with-react/
class LazyImage extends Component<ImageProps> {
  state = {
    onScreen: false,
  }

  // tslint:disable-next-line:no-null-keyword
  handleVisible = (_: null, data: VisibilityEventData) => {
    // TODO: Does it makes sense that once loaded, stay loaded?
    if (!this.state.onScreen) {
      this.setState(data.calculations)
    }
  }

  render() {
    const { size } = this.props
    const { onScreen } = this.state
    return (
      <Visibility offset={-300} fireOnMount onUpdate={this.handleVisible}>
        {onScreen ? (
          <Image
            {...this.props}
            onError={(event: SyntheticEvent<HTMLImageElement>) => {
              const target = event.target as HTMLImageElement
              target.src = squareImage
            }}
          />
        ) : (
          <Loader active inline="centered" size={size} />
        )}
      </Visibility>
    )
  }
}

export default LazyImage
