import React from "react"

const numberOfHours = 24
const hourLabelPeriod = 6
const dayLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const heatmapColors = ['#CFF3F7', '#90F5DA', '#25C8DA', '#1599B9']

const hourLabel = []

for (let i = 0; i < numberOfHours; i++) {
  hourLabel.push(i % hourLabelPeriod === 0 ? i : '')
}

const heatmapChartStyle = {
  display: 'flex',
  flexDirection: 'row',
  fontSize: '8px',
  paddingTop: '5px'
}

const rowStyle = {
  display: 'flex',
  flexDirection: "row"
}

const dayCellStyle = {
  width: '25px',
  margin: '-6px 0'
}

const cellStyle = {
  position: 'relative',
  border: '1px solid white',
  width: `${100/numberOfHours}%`,
  paddingBottom: `${100/numberOfHours}%`,
}

const labelRowStyle = {
  ...rowStyle,
  borderTop: '1px solid #F2F2F2',
  marginTop: '4px',
  paddingTop: '2px'
}

/**
 * @function HeatmapChartViz
 * @description Render heatmap chart, using in render function of chart card children
 * @param {Array} data Data to be visualized of each map view
 * @param {Array} max Max value of each map view
 * @return {React.Component}
 */
export default function HeatmapChartViz({
  data,
  max
}) {
  const allValue = data[0].flat()
  const maxValue = Math.max(...allValue)
  const minValue = Math.min(...allValue)
  const bins = data[0].map(row =>
    row.map(d => Math.floor((d - minValue) * (heatmapColors.length - 1) / (maxValue - minValue)))
  )

  return (
    <div style={heatmapChartStyle}>
      <div style={{ flex: 1, flexDirection: "column" }}>
        { bins.map((row, r) => (
          <div style={rowStyle} key={r}>
            <div style={dayCellStyle}>{dayLabel[r]}</div>
            { row.map((cell, c) =>(
              <div style={{ ...cellStyle, backgroundColor: heatmapColors[cell]}} key={c} />
            ))}
          </div>
        ))}
        <div style={labelRowStyle}>
          <div style={dayCellStyle}>Time</div>
          { hourLabel.map((hr, h) => (
            <div style={cellStyle} key={h}>
              <span style={{ position: 'absolute', top: '-6px' }}>{hr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
