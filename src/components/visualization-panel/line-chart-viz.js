import React from "react"
import { ResponsiveContainer, LineChart, Tooltip, Line } from "recharts"

/**
 * @function LineChartViz
 * @description Render line chart, using in render function of chart card children
 * @param {Array} data Data to be visualized of each map view
 * @param {Array} selections Array of each mapview selections
 * @param {Array} max Max value of each map view
 * @return {React.Component}
 */
export default function LineChartViz({
  data,
  selections,
  isFloating
}) {
  const reshapedData = []
  data.forEach((viewData, viewIndex) => {
    viewData.forEach((d, index) => {
      if(!reshapedData[index]) {
        reshapedData.push({
          id: index
        })
      }

      reshapedData[index][viewIndex] = d.value
    })
  })

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={reshapedData}>
        <Tooltip />
        { selections.map((selection, index) => (
          <Line
            key={selection.id}
            dataKey={index}
            stroke={selection.color.primary}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
