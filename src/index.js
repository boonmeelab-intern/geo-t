import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

import Explore from './pages/explore'
import Map from './pages/map'
import NotFound from './pages/not-found'

import './scss/reset.scss'
import './scss/style.scss'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Explore} />
        <Route exact path="/map" component={Map} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </Provider>,
document.getElementById('app'))
module.hot.accept()
