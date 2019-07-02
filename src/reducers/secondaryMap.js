import { combineReducers } from 'redux'
import types from '../constants'

// isLoading
export const isLoading = (state = [], action) =>
  (action.type === types.SET_ISLOADING_2) ? action.payload : state

// viewState
export const longitude = (state = [], action) =>
  (action.type === types.SET_LONGITUDE_2) ? parseFloat(action.payload) : state
export const latitude = (state = [], action) =>
  (action.type === types.SET_LATITUDE_2) ? parseFloat(action.payload) : state
export const zoom = (state = [], action) =>
  (action.type === types.SET_ZOOM_2) ? parseInt(action.payload, 10) : state
export const maxZoom = (state = [], action) =>
  (action.type === types.SET_MAXZOOM_2) ? parseInt(action.payload, 10) : state
export const minZoom = (state = [], action) =>
  (action.type === types.SET_MINZOOM_2) ? parseInt(action.payload, 10) : state
export const boundary = (state = [], action) =>
  (action.type === types.SET_BOUNDARY_2) ? action.payload : state

// layerSetting
export const cellSize = (state = [], action) =>
  (action.type === types.SET_CELLSIZE_2) ? parseInt(action.payload, 10) : state

// gridData
export const gridData = (state = [], action) => {
  switch (action.type) {
    case types.ADD_GRID_DATA_2:
      return [
        ...state,
        action.payload
      ]
    case types.CLEAR_GRID_DATA_2:
      return []
    default:
      return state
  }
}

// selectedData
export const selectedData = (state = [], action) => {
  switch (action.type) {
    case types.ADD_SELECTED_DATA_2:
      return [
        ...state,
        action.payload
      ]
    case types.CLEAR_SELECTED_DATA_2:
      return []
    default:
      return state
  }
}

// panelData
export const panelData = (state = [], action) =>
  (action.type === types.SET_PANEL_DATA_2) ? action.payload : state

// tooltip
export const tooltip = (state = [], action) =>
  (action.type === types.SET_TOOLTIP_2) ? action.payload : state

// popup
export const popup = (state = [], action) =>
  (action.type === types.SET_POPUP_2) ? action.payload : state

// timeFilter
export const timeFilter = (state = [], action) =>
  (action.type === types.SET_TIMEFILTER_2) ? action.payload : state

// featureFilter
export const featureFilter = (state = [], action) => {
  switch (action.type) {
    case types.SET_FEATURE_FILTER_2:
      return (
        action.payload
      )
    case types.CLEAR_FEATURE_FILTER_2:
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