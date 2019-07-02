import React from "react"
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from "recharts"

import "../../scss/pie-chart-card.scss"

const CELL_COLORS = ['#3c6ef0', '#90F5DA', '#25C8DA', '#1599B9']
const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize={10}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      { index === 0 ? `${(percent * 100).toFixed(0)}%` : ''}
    </text>
  )
}

/**
 * @function PieChartViz
 * @description Render mirror bar chart, using in render function of chart card children
 * @param {Array} data Data to be visualized of each map view
 * @return {React.Component}
 */
export default function PieChartViz({
  data
}) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <PieChart>
        <Pie
          data={data[0]}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={60}
          fill="#8884d8"
          dataKey="value"
        >
          {data[0].map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CELL_COLORS[index % CELL_COLORS.length]}
            />
          ))}
        </Pie>
        <Legend
          align="right"
          verticalAlign="middle"
          layout="vertical"
          iconSize={10}
          formatter={(value, entry, index) => 
            <span style={{ fontSize: 10 }}>{data[0][index].label}</span>
          }
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
