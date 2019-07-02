import React from "react"

import Card from "../card"
import SquareBullet from './square-bullet'

import '../../scss/chart-card.module.scss'

/**
 * @function ChartCard
 * @description Render card with input texts and chart
 * @param {String} label Card label
 * @param {Array} data Data to be visualized of each map view
 * @param {Array} selections Array of each mapview selections
 * @param {Function} children Function to render chart with chartData object (containing data, selections, max) as a param
 * @param {Function} renderHeadingText Function to render heading text for each map view (Params: viewData, viewMax, viewSum)
 * @param {Function} renderSubheadingText Function to render subheading text for each map view (Params: viewData, viewMax, viewSum)
 * @param {Boolean} isFloating Set floating/docking position of the panel
 * @param {Object} style Custom style to be added to the card
 * @return {React.Component}
 */
export default function ChartCard({
  label,
  data,
  selections,
  children = () => '',
  renderHeadingText = () => '',
  renderSubheadingText = () => '',
  isFloating,
  style
}) {
  const max = data.map(viewData => Math.max(...viewData.map(d => d.value)))
  const sum =  data.map(viewData => viewData.reduce((total, d) => total + d.value, 0))
  const heading = data.map((viewData, index) => ({
    bulletColor: selections[index].color.primary,
    maintext: renderHeadingText(viewData, max[index], sum[index]),
    postfix: renderSubheadingText(viewData, max[index], sum[index])
  })).filter((viewData, index) => selections[index].cells.length > 0)

  return (
    <Card isFloating={isFloating} style={style}>
      <div className="column">
        <div className="row">
          <p className="pre-heading">{label}</p>
        </div>
        <div className="row">
          { heading && heading.map((head, headIndex) => (
            <div className="row" key={headIndex}>
              { !isFloating &&
                <div>
                  <SquareBullet color={head.bulletColor} margin="8px 8px 0 0"/>
                </div>
              }
              <div className="column">
                <h4 className="heading">{head.maintext}</h4>
                <span>{head.postfix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      { children({ data, selections, max }) }
    </Card>
  )
}
