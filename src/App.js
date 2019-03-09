import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import 'react-semantic-toasts/styles/react-semantic-alert.css'
import Main from './Main'
import { Dimmer, Loader } from 'semantic-ui-react'
import { SemanticToastContainer } from 'react-semantic-toasts'

@inject('store') @observer
class App extends Component {
  componentDidMount () {
    const { store } = this.props
    store.fetchProfile().then(() => {
      store.fetchGroups()
    })
  }
  render () {
    const { store } = this.props
    const view = store.online ? (
      <Main />
    ) : (
      <Dimmer active={store.status !== 'online'}>
        <Loader size='massive' />
      </Dimmer>
    )
    return (
      <div className='App'>
        {view}
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
