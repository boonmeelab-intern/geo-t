import React, { useState } from 'react'

import Header from "../components/header"
import MapContainer from "../components/map-container"
import VisualizationPanel from "../components/visualization-panel/visualization-panel"
import API from "../libs/mockupAPI"

import '../scss/map-page.scss'

const mapViewColorPalette = [
  { primary: '#3c6ef0', secondary: '#dfeef0' },
  { primary: '#90F5DA', secondary: '#d6fcef' }
]

/**
 * @param {object} props
 * @param {object} props.data
 */
export default function MapPage(props) {
  const [mapViews, setMapViews] = useState([{
    id: new Date().getTime(),
    selection: { cells: [] }
  }])

  const pushMapView = () => {
    setMapViews([ ...mapViews, {
      id: new Date().getTime(),
      selection: { 
        id: new Date().getTime(),
        cells: []
      }
    }])
  }

  const popMapView = () => {
    const currentMapView = [...mapViews]
    currentMapView.pop()
    setMapViews(currentMapView)
  }

  const setViewSelection = (viewId, cells, cellSize) => {
    const currentMapView = [...mapViews]
    currentMapView[currentMapView.findIndex(view => view.id === viewId)].selection = {
      id: new Date().getTime(),
      cells,
      cellSize
    }
    setMapViews(currentMapView)
  }

  return (
    <React.Fragment>
      <Header siteTitle="True Geo Analytics" onCompareToggle={mapViews.length > 1 ? popMapView : pushMapView} />
      <div className="map-wrapper">
        { mapViews.map(view => (
          <MapContainer
            key={view.id}
            locations={API.getGridData()}
            selectedCells={view.selection.cells}
            updateViewSelection={(cells, cellSize) => setViewSelection(view.id, cells, cellSize)}
          />
        ))}
        
        { mapViews.reduce((sum, view) => sum + view.selection.cells.length, 0) > 0 && (
          <VisualizationPanel
            selections={mapViews.map((view, viewIndex) => ({ ...view.selection, color: mapViewColorPalette[viewIndex] }))}
            visualizeData={API.getVisualizeData(mapViews)}
            isFloating={mapViews.length === 1}
          />
        )}
      </div>
    </React.Fragment>
  )
}
