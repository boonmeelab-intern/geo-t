import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default class PieChartTemplate extends React.Component {

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
        <PieChart width={280} height={150}>
          <Legend layout="vertical" verticalAlign="middle" align="right" />
          <Tooltip />
          <Pie data={data} dataKey="value" nameKey="label" fill="#41A2F1">
            {data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={entry}/>)}
          </Pie>
       </PieChart>
      </div>
    )
  }
}