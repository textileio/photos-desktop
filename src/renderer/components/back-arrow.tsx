import React, { Component } from 'react'
import { Label, Icon, LabelProps } from 'semantic-ui-react'

export default class BackArrow extends Component<LabelProps> {
  render() {
    const { name, inverted, ...props } = this.props
    return (
      <Label
        {...props}
        as="a"
        basic
        size="large"
        circular
        onClick={() => {
          window.history.back()
        }}
        style={{
          color: inverted ? 'white' : 'black',
          position: 'absolute',
          right: '0',
          top: '0',
          zIndex: '10',
          border: 'none',
        }}
      >
        <Icon link name={name ? name : 'arrow left'} />
      </Label>
    )
  }
}
