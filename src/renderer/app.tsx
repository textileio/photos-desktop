import React from 'react'
import { observer } from 'mobx-react'
import 'react-semantic-toasts/styles/react-semantic-alert.css'
import { Router, LocationProvider, navigate } from '@reach/router'
import { SemanticToastContainer } from 'react-semantic-toasts'
import { Stores } from './stores'
import { ConnectedComponent, connect } from './components/ConnectedComponent'
import { RouteComponentProps } from '@reach/router'
import Welcome from './pages/welcome'
// import Settings from './pages/settings'
import Automatic from './pages/automatic'
import Signin from './pages/signin'
import Loading from './pages/loading'
import Main from './containers/Main'
import Start from './pages/start'
import backgroundPath from './assets/code.svg'

@connect(
  'user',
  'store',
)
@observer
class App extends ConnectedComponent<RouteComponentProps, Stores> {
  componentWillMount() {
    if ([...this.stores.user.repos].length > 0) {
      navigate('/start')
      return
    }
    navigate('/welcome')
  }
  render() {
    return (
      <div style={{ background: `url("${backgroundPath}") no-repeat top fixed` }}>
        <LocationProvider>
          <Router>
            <Loading default />
            <Welcome path="/welcome" />
            <Start path="/start" />
            <Main path="/main" />
            <Automatic path="/automatic" />
            <Signin path="/signin" />
          </Router>
        </LocationProvider>
        <SemanticToastContainer />
      </div>
    )
  }
}

export default App
