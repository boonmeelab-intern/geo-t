import React from "react"
import { BarChart, Bar, Cell } from "recharts"

import "../../scss/mirror-bar-chart-viz.scss"

const chartCustomStyle = {
  margin: 'auto',
  transform: 'rotate(90deg)',
  bottom: 115
}

/**
 * @function MirrorBarChartViz
 * @description Render mirror bar chart, using in render function of chart card children
 * @param {Array} data Data to be visualized of each map view
 * @param {Array} selections Array of each mapview selections
 * @param {Array} max Max value of each map view
 * @return {React.Component}
 */
export default function MirrorBarChartViz({
  data,
  selections,
  max
}) {
  const reshapeData = data.map(viewData => ({
    leftPadding: Math.min(viewData[0].value-viewData[1].value, 0),
    leftData: -viewData[0].value,
    rightData: viewData[1].value,
    rightPadding: Math.max(viewData[0].value-viewData[1].value, 0)
  }))

  return (
    <div className="container">
      <BarChart width={50} height={300} data={reshapeData} stackOffset="sign" style={chartCustomStyle}>
        <Bar dataKey="leftData" stackId="stack">
          { selections.map((selection, selectionIndex) => 
            <Cell
              key={`${selection.id}-leftData`}
              fill={selection.color[data[selectionIndex][0].value === max[selectionIndex] ? 'primary' : 'secondary']}
            />
          )}
        </Bar>
        <Bar dataKey="leftPadding" stackId="stack">
          { selections.map((selection, selectionIndex) =>
            <Cell key={`${selection.id}-leftPadding`} fill="#ffffff" />
          )}
        </Bar>
        <Bar dataKey="rightData" stackId="stack">
          { selections.map((selection, selectionIndex) => 
            <Cell
              key={`${selection.id}-rightData`}
              fill={selection.color[data[selectionIndex][1].value === max[selectionIndex] ? 'primary' : 'secondary']}
            />
          )}
        </Bar>
        <Bar dataKey="rightPadding" stackId="stack">
          { selections.map((selection, selectionIndex) =>
            <Cell key={`${selection.id}-rightPadding`} fill="#ffffff" />
          )}
        </Bar>
      </BarChart>
      
      <div className="label-container">
        <div style={{ flex: 1, textAlign: 'right', paddingRight: '10px' }}>{data[0][0].label}</div>
        <div style={{ flex: 1 }}>{data[0][1].label}</div>
      </div>

      <div className="reference-line" />
    </div>
  )
}
