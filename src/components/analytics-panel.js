import React, { Component } from 'react'
import { connect } from 'react-redux'

import LineChartTemplate from './templates/line-chart-template'
import BarChartTemplate from './templates/bar-chart-template'
import PieChartTemplate from './templates/pie-chart-template'

import '../scss/analytics-panel.scss'

const mapState = state => ({
  mainMap: state.mainMap
})

class AnalyticsPanel extends Component {
  state = {
    open: true
  }

  generateDataViz = panelData => panelData.map(({ title, data }) => {
    // Pie Chart
    if (title === 'customer_segment' || title === 'social_app_usage') {
      return (<PieChartTemplate title={title} data={data} key={title} />)
    }
    // Bar Chart
    if (title === 'age_group' || title === 'customer_type') {
      return (<BarChartTemplate title={title} data={data} key={title} />)
    } 
    // Line Chart
    return (<LineChartTemplate title={title} data={data} key={title} />)
  })

  _onClick = () => {
    const currentState = this.state.open
    this.setState({ open: !currentState })
  }

  render() {
    const { panelData } = this.props.mainMap
    return (
      <React.Fragment>
        {Object.entries(panelData).length !== 0 &&
        <div id="analytics-panel" className={(this.state.open) ? 'active' : ''}>
          <button className="collapse-btn" onClick={this._onClick}>{'>'}</button>
          <div className="cards">
            {this.generateDataViz(panelData)}
          </div>
        </div>}
      </React.Fragment>
    )
  }
}

export default connect(mapState)(AnalyticsPanel)