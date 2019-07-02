import React from 'react'
import { LineChart, Line, XAxis, Tooltip } from 'recharts';

export default class LineChartTemplate extends React.Component {

  _getHighestValue = data => {
    let name = null
    let highest = null
    let sum = 0
    data.map(list => {
      sum += list.value
      if (list.value > highest) {
        name = list.label
        highest = list.value
      }
    })
    const percentage = (highest/sum) * 100
    return [name, percentage.toFixed(2)]
  }

  render() {
    const { title, data } = this.props
    const [highestName, percentage] = this._getHighestValue(data)
    return (
      <div className="card" key={data}>
        <h3>{title}</h3>
        <h4>{highestName} {percentage}%</h4>
        <LineChart width={280} height={150} data={data}>
          <XAxis dataKey="label" interval="preserveStartEnd" />
          <Tooltip />
          <Line dataKey="value" fill="#41A2F1" />
        </LineChart>
      </div>
    )
  }
}