import React, { Component } from 'react'
import { StaticMap, Popup } from 'react-map-gl'
import DeckGL, { WebMercatorViewport } from 'deck.gl'
import { isWebGL2 } from 'luma.gl'
import { connect } from 'react-redux'

import store from '../store'
import * as actions from '../actions'
import TimeFilter from './time-filter'
import FeatureFilter from './feature-filter'
import AnalyticsPanel from './analytics-panel'
import HeatmapLegend from './heatmap-legend'
import renderLayers from './map-layers'
import { queryGridData, queryDataViz } from './query-data'
import { tooltipStyle } from '../styles/style'

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken // eslint-disable-line

const mapState = state => ({
  compareView: state.compareView,
  mainMap: state.mainMap,
  secondaryMap: state.secondaryMap
})

const colorRange = [
  // [55, 128, 185, 255],
  // [74, 163, 177, 255],
  [105, 195, 164, 255],
  [129, 204, 164, 255],
  [148, 211, 164, 255],
  [173, 221, 162, 255],
  [205, 234, 156, 255],
  // [249, 252, 183, 255],
  // [254, 245, 174, 255],
  [254, 237, 162, 255],
  [254, 235, 159, 255],
  [253, 220, 136, 255],
  [253, 205, 123, 255],
  [251, 168, 93, 255],
  [248, 145, 83, 255],
  [245, 121, 72, 255],
  [241, 105, 67, 255],
  [230, 88, 71, 255],
  [201, 49, 75, 255],
  [181, 27, 71, 255],
  [158, 0, 65, 255]
]

const dataBound = {
  latitude: {
    min: 13.491638,
    max: 13.958753
  },
  longitude: {
    min: 100.337131,
    max: 100.929733
  }
}

class Map extends Component {
  state = {
    mapKey: '',
    viewport_boundary: {
      from: {
        coordinates: [100.39284686837435, 13.668420755666844]
      },
      to: {
        coordinates: [100.68680980878943, 13.831217463713532]
      },
      center: {
        coordinates: [100.54, 13.75]
      },
      zoom: 12
    },
    dragged: false
  }

  componentWillMount() {
    const { mapKey } = this.props
    this.setState({ mapKey })
  }

  limitViewportBoundary(viewState) {
    const { mapKey } = this.state
    let changed = false
    if (viewState.longitude < dataBound.longitude.min) {
      viewState.longitude = dataBound.longitude.min
      changed = true
    } else if (viewState.longitude > dataBound.longitude.max) {
      viewState.longitude = dataBound.longitude.max
      changed = true
    }

    if (viewState.latitude < dataBound.latitude.min) {
      viewState.latitude = dataBound.latitude.min
      changed = true
    } else if (viewState.latitude > dataBound.latitude.max) {
      viewState.latitude = dataBound.latitude.max
      changed = true
    }

    if (changed && mapKey === 'mainMap') {
      store.dispatch(actions.setLongitude(viewState.longitude))
      store.dispatch(actions.setLatitude(viewState.latitude))
    }
    if (changed && mapKey === 'secondaryMap') {
      store.dispatch(actions.setLongitude2(viewState.longitude))
      store.dispatch(actions.setLatitude2(viewState.latitude))
    }
  }

  defineViewportBoundary(viewState) {
    const { mapKey, viewport_boundary } = this.state
    const { longitude, latitude, width, height } = viewState

    const zoom = viewState.zoom - 0.25
    const webMercatorViewport = new WebMercatorViewport({ ...viewState, zoom })
    const [x, y] = webMercatorViewport.project([longitude, latitude])
    const [minLng, minLat] = webMercatorViewport.unproject([x - (width/2), y + (height/2)])
    const [maxLng, maxLat] = webMercatorViewport.unproject([x + (width/2), y - (height/2)])

    // set state boundary to state
    viewport_boundary.from.coordinates = [minLng, minLat]
    viewport_boundary.to.coordinates = [maxLng, maxLat]
    viewport_boundary.center.coordinates = [longitude, latitude]
    viewport_boundary.zoom = parseInt(viewState.zoom, 10)
    this.setState({ viewport_boundary })

    // set state boundary to store
    const lngBound = [minLng, maxLng]
    const latBound = [minLat, maxLat]
    if (mapKey === 'mainMap') {
      store.dispatch(actions.setBoundary({lngBound, latBound}))
    }
    if (mapKey === 'secondaryMap') {
      store.dispatch(actions.setBoundary2({lngBound, latBound}))
    }

    queryGridData(mapKey)
  }

  _onHover({ x, y, object }) {
    const { mapKey } = this.state
    const fid = object ? object.points[0].fid : null
    const density = object ? object.points.reduce((total, el) => total + el.density, 0) : null
    const tooltip = { x, y, hoveredObject: object, fid, density }
    const secondaryMapWidth = document.querySelector('.map-container > .map:first-child').offsetWidth

    if (mapKey === 'mainMap') {
      store.dispatch(actions.setTooltip(tooltip))
    }
    if (mapKey === 'secondaryMap') {
      tooltip.x += secondaryMapWidth
      store.dispatch(actions.setTooltip(tooltip))
    }
  }

  _onClick(info) {
    const { mapKey } = this.state
    const cellsize = info.layer.props.cellSize
    const viewport = new WebMercatorViewport({...this.props[mapKey].viewState})
    const [offsetX, offsetY] = viewport.metersToLngLatDelta([cellsize,cellsize])

    // define popup's position and information
    const x = info.object.position[0] + (offsetX / 2)
    const y = info.object.position[1] + offsetY
    const label = `${x}, ${y}`
    const popup = { x, y, clickedObject: info.object, label }

    // define border of selected grid data
    const selectedGrid1 = [info.object.position[0], info.object.position[1]]
    const selectedGrid2 = [info.object.position[0], info.object.position[1] + offsetY]
    const selectedGrid3 = [info.object.position[0] + offsetX, info.object.position[1] + offsetY]
    const selectedGrid4 = [info.object.position[0] + offsetX, info.object.position[1]]
    const selectedGridPath = [selectedGrid1, selectedGrid2, selectedGrid3, selectedGrid4, selectedGrid1]
    const selectedData = {
      fid: info.object.points[0].fid,
      zoom: Math.trunc(store.getState()[mapKey].viewState.zoom),
      path: selectedGridPath
    }

    if (mapKey === 'mainMap') {
      store.dispatch(actions.setPopup(popup))
      store.dispatch(actions.clearSelectedData())
      store.dispatch(actions.addSelectedData(selectedData))
    }
    if (mapKey === 'secondaryMap') {
      store.dispatch(actions.setPopup2(popup))
      store.dispatch(actions.clearSelectedData2())
      store.dispatch(actions.addSelectedData2(selectedData))
    }

    queryDataViz(mapKey)
  }

  _onDragEnd() {
    this.setState({ dragged: true })
  }

  _updateCellSize(viewState) {
    const { mapKey } = this.state
    const cellsize = [
      {zoom: 8, cellsize: 16000},
      {zoom: 9, cellsize: 8000},
      {zoom: 10, cellsize: 4000},
      {zoom: 11, cellsize: 2000},
      {zoom: 12, cellsize: 1000},
      {zoom: 13, cellsize: 500},
      {zoom: 14, cellsize: 250}
    ]
    const { layerSettings } = this.props[mapKey]
    const current_cellsize = layerSettings.cellSize
    let new_cellsize = 250
    
    for (var i = 0; i < cellsize.length; i++) {
      if (viewState.zoom < (cellsize[i].zoom)) {
        new_cellsize = cellsize[i].cellsize
        break;
      }
    }
    
    if (new_cellsize !== current_cellsize && mapKey === 'mainMap') {
      store.dispatch(actions.setCellSize(new_cellsize))
    }
    if (new_cellsize !== current_cellsize && mapKey === 'secondaryMap') {
      store.dispatch(actions.setCellSize2(new_cellsize))
    }
  }

  _onViewStateChange({ viewState }) {
    const { mapKey } = this.state
    // update viewport
    if (mapKey === 'mainMap') {
      store.dispatch(actions.setLatitude(viewState.latitude))
      store.dispatch(actions.setLongitude(viewState.longitude))
      store.dispatch(actions.setZoom(viewState.zoom))
    }
    if (mapKey === 'secondaryMap') {
      store.dispatch(actions.setLatitude2(viewState.latitude))
      store.dispatch(actions.setLongitude2(viewState.longitude))
      store.dispatch(actions.setZoom2(viewState.zoom))
    }

    // limit panning boundary depended on available data
    this.limitViewportBoundary(viewState)

    // define delta of changing viewport, which will use for fetching new grid data
    const { longitude, latitude, zoom } = viewState
    const { viewport_boundary, dragged } = this.state
    const [lastLng, lastLat] = viewport_boundary.center.coordinates
    const lastZoom = viewport_boundary.zoom
    const minDelta = zoom > 12 ? zoom > 13 ? 0.005 : 0.01 : 0.02
    const deltaLng = Math.abs(lastLng - longitude)
    const deltaLat = Math.abs(lastLat - latitude)
    const deltaZoom = Math.abs(lastZoom - parseInt(zoom, 10))
    
    if ((dragged || deltaZoom !== 0) && 
    (deltaLng > minDelta || deltaLat > minDelta || deltaZoom > 1 || deltaZoom === 1)) {
      this.setState({ dragged: false })
      this.defineViewportBoundary(viewState)
      this._updateCellSize(viewState)
    }
  }

  _onInitialized(gl) {
    if (!isWebGL2(gl)) {
      console.warn('GPU aggregation is not supported') // eslint-disable-line
      if (this.props.disableGPUAggregation) {
        this.props.disableGPUAggregation()
      }
    }
  }

  render() {
    const { mapKey, compareView } = this.props
    const { isLoading, viewState, gridData, selectedData, layerSettings, tooltip, popup } = this.props[mapKey]
    const selectedDataOnSameZoomLevel = (selectedData.length > 0) ? (selectedData[0].zoom === Math.trunc(viewState.zoom)) : false
    return (
      <div className="map">
        <div id="side-panel">
          <TimeFilter mapKey={mapKey} />
          <FeatureFilter mapKey={mapKey} />
        </div>
        {!compareView && <AnalyticsPanel />}
        {tooltip.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${tooltip.x}px, ${tooltip.y}px)`
            }}
          >
            <div>
              <span>fid: {tooltip.fid}</span><br />
              <span>density: {tooltip.density}</span></div>
          </div>
        )}
        <DeckGL
          layers={renderLayers({
            gridData,
            selectedData,
            colorRange,
            zoom: Math.trunc(viewState.zoom),
            onHover: hover => this._onHover(hover),
            onClick: click => this._onClick(click),
            layerSettings
          })}
          initialViewState={viewState}
          onWebGLInitialized={this._onInitialized.bind(this)}
          onViewStateChange={this._onViewStateChange.bind(this)}
          onDragEnd={this._onDragEnd.bind(this)}
          controller
        >
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/light-v9"
            preventStyleDiffing
            mapboxApiAccessToken={MAPBOX_TOKEN}
          >
            {isLoading && (<div className="preloader"><img src="/images/preloader.gif" alt="preload" /></div>)}
            {popup.clickedObject && selectedDataOnSameZoomLevel && (
              <Popup
                longitude={popup.x}
                latitude={popup.y}
                closeButton={false}
              >
                <div><p>{popup.label}</p></div>
              </Popup>
            )}
          </StaticMap>
        </DeckGL>
        <HeatmapLegend colorRange={colorRange} />
      </div>
      
    )
  }
}

export default connect(mapState)(Map)