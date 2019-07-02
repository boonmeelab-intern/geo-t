import React from "react"

import SelectionInfoCard from "./selection-info-card"
import ChartCard from "./chart-card"
import BarChartViz from "./bar-chart-viz"
import PieChartViz from "./pie-chart-viz"
import HeatmapChartViz from "./heatmap-chart-viz"
import LineChartViz from "./line-chart-viz"
import MirrorBarChartViz from "./mirror-bar-chart-viz"

import "../../scss/visualization-panel.module.scss"

/**
 * @function VisualizationPanel
 * @description Render information and multiple charts according to the selection
 * @param {Array} selections Array of each mapview selections
 * @param {Object} visualizeData Containing data of each chart that will be shown
 * @param {Boolean} isFloating Set floating/docking position of the panel
 * @return {React.Component}
 */
const VisualizationPanel = ({ selections, visualizeData, isFloating }) => {
  const {
    totalCustomer,
    age,
    prePostPaid,
    timeOfTheDay,
    customerSegment
  } = visualizeData

  return (
    <div
      className={`viz-panel ${
        isFloating ? "floating" : ""
      }`}
    >
      <SelectionInfoCard
        selections={selections}
        isFloating={isFloating}
      />
      <div
        className={
          isFloating
            ? "row"
            : "column"
        }
      >
        <div className="column">
          { selections.length > 1 &&
            <ChartCard
            label="Total Customer"
            data={totalCustomer}
            selections={selections}
            renderHeadingText={(viewData, viewMax, viewSum) => viewSum}
            isFloating={isFloating}
            >
              { chartData => <LineChartViz { ...chartData } /> }
            </ChartCard>
          }
          <ChartCard
            label="Age"
            data={age}
            selections={selections}
            renderHeadingText={(viewData, viewMax, viewSum) => `${viewData.find(d => d.value === viewMax).label}y`}
            renderSubheadingText={(viewData, viewMax, viewSum) => `${Math.round(viewMax * 100 / viewSum)}%`}
            isFloating={isFloating}
          >
            { chartData => <BarChartViz { ...chartData } /> }
          </ChartCard>
          <ChartCard
            label="Post / Prepaid"
            data={prePostPaid}
            selections={selections}
            renderHeadingText={(viewData, viewMax, viewSum) => `${viewData.find(d => d.value === viewMax).label}`}
            renderSubheadingText={(viewData, viewMax, viewSum) => `${Math.round(viewMax * 100 / viewSum)}%`}
            isFloating={isFloating}
          >
            { chartData => <MirrorBarChartViz { ...chartData } /> }
          </ChartCard>
        </div>
        { selections.length === 1 &&
          <div className="column">
            <ChartCard
              label="Time of the Day"
              data={timeOfTheDay}
              selections={selections}
              isFloating={isFloating}
            >
              { chartData => <HeatmapChartViz { ...chartData } /> }
            </ChartCard>
            <ChartCard
              label="Customer Segmentation"
              data={customerSegment}
              selections={selections}
              renderHeadingText={(viewData, viewMax, viewSum) => viewData[0].label}
              renderSubheadingText={(viewData, viewMax, viewSum) => `${Math.round(viewData[0].value * 100 / viewSum)}%`}
              isFloating={isFloating}
            >
              { chartData => <PieChartViz { ...chartData } /> }
            </ChartCard>
          </div>
        }
      </div>
    </div>
  )
}

export default VisualizationPanel
