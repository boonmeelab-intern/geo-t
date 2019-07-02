import { combineReducers } from 'redux'
import types from '../constants'

// isLoading
export const isLoading = (state = [], action) =>
  (action.type === types.SET_ISLOADING) ? action.payload : state

// viewState
export const longitude = (state = [], action) =>
  (action.type === types.SET_LONGITUDE) ? parseFloat(action.payload) : state
export const latitude = (state = [], action) =>
  (action.type === types.SET_LATITUDE) ? parseFloat(action.payload) : state
export const zoom = (state = [], action) =>
  (action.type === types.SET_ZOOM) ? parseInt(action.payload, 10) : state
export const maxZoom = (state = [], action) =>
  (action.type === types.SET_MAXZOOM) ? parseInt(action.payload, 10) : state
export const minZoom = (state = [], action) =>
  (action.type === types.SET_MINZOOM) ? parseInt(action.payload, 10) : state
export const boundary = (state = [], action) =>
  (action.type === types.SET_BOUNDARY) ? action.payload : state

// layerSetting
export const cellSize = (state = [], action) =>
  (action.type === types.SET_CELLSIZE) ? parseInt(action.payload, 10) : state

// gridData
export const gridData = (state = [], action) => {
  switch (action.type) {
    case types.ADD_GRID_DATA:
      return [
        ...state,
        action.payload
      ]
    case types.CLEAR_GRID_DATA:
      return []
    default:
      return state
  }
}

// selectedData
export const selectedData = (state = [], action) => {
  switch (action.type) {
    case types.ADD_SELECTED_DATA:
      return [
        ...state,
        action.payload
      ]
    case types.CLEAR_SELECTED_DATA:
      return []
    default:
      return state
  }
}

// panelData
export const panelData = (state = [], action) =>
  (action.type === types.SET_PANEL_DATA) ? action.payload : state

// tooltip
export const tooltip = (state = [], action) =>
  (action.type === types.SET_TOOLTIP) ? action.payload : state

// popup
export const popup = (state = [], action) =>
  (action.type === types.SET_POPUP) ? action.payload : state

// timeFilter
export const timeFilter = (state = [], action) =>
  (action.type === types.SET_TIMEFILTER) ? action.payload : state

// featureFilter
export const featureFilter = (state = [], action) => {
  switch (action.type) {
    case types.SET_FEATURE_FILTER:
      return (
        action.payload
      )
    case types.CLEAR_FEATURE_FILTER:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  isLoading,
  viewState: combineReducers({
    longitude,
    latitude,
    zoom,
    maxZoom,
    minZoom,
    boundary
  }),
  layerSettings: combineReducers({
    cellSize
  }),
  gridData,
  selectedData,
  panelData,
  tooltip,
  popup,
  timeFilter,
  featureFilter
})