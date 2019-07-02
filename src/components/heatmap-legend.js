import React from 'react'

const HeatmapLegend = ({ colorRange }) => {
  const test = colorRange.map((item, index) => {
    const backgroundColor = { background: `rgba(${item[0]},${item[1]},${item[2]},${item[3]})` }
    return (<span className="heatmap-legend-item" style={backgroundColor} key={item} />)
  })
  return (
    <div className="heatmap-legend">{test}</div>
  )
}

export default HeatmapLegend