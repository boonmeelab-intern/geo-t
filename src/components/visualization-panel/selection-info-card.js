import React from "react"

import Card from "../card"
import SquareBullet from "./square-bullet"

import "../../scss/selection-info-card.module.scss"

function getHeaderText (cellList) {
  switch (cellList.length) {
    case 0: return 'No Selection'
    case 1: return `ID: ${cellList[0].fid}`
    default: return `${cellList.length} Grids`
  }
}

/**
 * @function SelectionInfoCard
 * @description Render a card containing information of the current selections
 * @param {Array} selections Array of each mapview selections
 * @param {Boolean} isFloating Set floating/docking position of the panel
 * @return {React.Component}
 */
export default function SelectionInfoCard({ selections, isFloating }) {
  return (
    <Card
      isFloating={isFloating}
      style={ isFloating ? { borderLeft: '8px solid #E1F5FC'} : {}}
    >
      <div
        className={`info-container ${
          !isFloating ? "container-expand" : ""
        }`}
      >
        <div className={`main-info${ !isFloating ? " expanded" : "" }`}>
          { selections.map((selection, selectionIndex) => (
            <div key={selection.id} className="selection-container">
              <span>
                { selections.length > 1 &&
                  <SquareBullet color={selection.color.primary} margin="4px 6px 0 0"/>
                }
                <span>
                  { selections.length > 1 ? `VIEW ${selectionIndex + 1}` : 'SELECTION' }
                </span>
              </span>
              <h3>{ getHeaderText(selection.cells) }</h3>
              <div>{ selection.cells.length > 0 ? selection.cells.length * selection.cellSize : '-' } sq.m.</div>
            </div>
          )) }
          
        </div>
        <div className={`filter-info${ !isFloating ? " expanded" : "" }`}>
          <div>True User Data</div>
          <div>1 JAN 2019 - 21 JAN 2019 / Fri Sat / 8.00 -18.00</div>
          <div>Custom Filter - 1</div>
        </div>
        <div className="download">DL</div>
      </div>
    </Card>
  )
}
