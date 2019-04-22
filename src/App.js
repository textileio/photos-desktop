import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import 'react-semantic-toasts/styles/react-semantic-alert.css'
import Main from './Containers/Main'
import WithLoadingIndicator from './Components/WithLoadingIndicator'
import { SemanticToastContainer } from 'react-semantic-toasts'

const MainWithLoader = WithLoadingIndicator(Main)

@inject('store') @observer
class App extends Component {
  componentDidMount () {
    const { store } = this.props
    store.fetchProfile().then(() => {
      store.fetchGroups().then(() => {
        store.fetchContacts()
      })
    })
  }
  render () {
    const { store } = this.props
    return (
      <div>
        <MainWithLoader isLoading={!store.online} />
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
