import React from "react"
import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar, Cell } from "recharts"

export default function BarChartViz({
  data,
  selections,
  max
}) {
  const reshapedData = data[0].map((x, index) => ({
    label: x.label,
    ...data.map(viewData => viewData[index].value)
  }))

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={reshapedData}>
        <XAxis dataKey="label" type="category" tick={{fontSize: 10}} axisLine={false} tickLine={false} interval={0} />
        <Tooltip />
        { selections.map((selection, selectionIndex) => (
            <Bar key={selection.id} dataKey={selectionIndex}>
              { data[selectionIndex].map(d => (
                <Cell key={d.label} fill={selection.color[d.value === max[selectionIndex] ? 'primary' : 'secondary']}/>
              ))}
            </Bar>
          ))
        }
      </BarChart>
    </ResponsiveContainer>
  )
}
