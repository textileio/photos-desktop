import React from 'react'
import { observer} from 'mobx-react'
import 'react-semantic-toasts/styles/react-semantic-alert.css'
import Main from './Containers/Main'
import { SemanticToastContainer } from 'react-semantic-toasts'
import { Stores } from './Store'
import { Dimmer, Loader } from 'semantic-ui-react'
import { ConnectedComponent, connect } from './Components/ConnectedComponent'

@connect('store') @observer
class App extends ConnectedComponent<{}, Stores> {
  componentDidMount() {
    const { store } = this.stores
    store.fetchProfile().then(() => {
      store.fetchGroups().then(() => {
        store.fetchContacts()
      })
    })
  }
  render() {
    const { store } = this.stores
    return (
      <div>
        {store.online ?
          <Main /> :
          <Dimmer inverted active>
            <Loader size='massive' />
          </Dimmer>
        }
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
