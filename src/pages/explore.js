import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'
import * as actions from '../actions'

import Map from '../components/map'

const mapState = state => ({
  compareView: state.compareView
})

class Explore extends Component {
  test = () => {
    const cur = store.getState().compareView
    store.dispatch(actions.setCompareView(!cur))
  }

  render() {
    const { compareView } = this.props
    return (
      <React.Fragment>
        <div>Header</div>
        <button onClick={this.test}>compare</button>
        <div className="map-container">
          <Map mapKey="mainMap" />
          {compareView && <Map mapKey="secondaryMap" />}
          {compareView && <div className="compare-panel">panel</div>}
        </div>
      </React.Fragment>
    )
  }
}

export default connect(mapState)(Explore)