import types from '../constants'

// mainMap
export const setIsLoading = action => ({
  type: types.SET_ISLOADING,
  payload: action
})

export const setLongitude = action => ({
  type: types.SET_LONGITUDE,
  payload: action
})
export const setLatitude = action => ({
  type: types.SET_LATITUDE,
  payload: action
})
export const setZoom = action => ({
  type: types.SET_ZOOM,
  payload: action
})
export const setBoundary = action => ({
  type: types.SET_BOUNDARY,
  payload: action
})

export const setCellSize = action => ({
  type: types.SET_CELLSIZE,
  payload: action
})

export const addGridData = action => ({
  type: types.ADD_GRID_DATA,
  payload: action
})
export const clearGridData = () => ({
  type: types.CLEAR_GRID_DATA
})
export const addSelectedData = action => ({
  type: types.ADD_SELECTED_DATA,
  payload: action
})
export const clearSelectedData = () => ({
  type: types.CLEAR_SELECTED_DATA
})
export const setPanelData = action => ({
  type: types.SET_PANEL_DATA,
  payload: action
})
export const setTooltip = action => ({
  type: types.SET_TOOLTIP,
  payload: action
})
export const setPopup = action => ({
  type: types.SET_POPUP,
  payload: action
})

export const setTimeFilter = action => ({
  type: types.SET_TIMEFILTER,
  payload: action
})
export const setFeatureFilter = action => ({
  type: types.SET_FEATURE_FILTER,
  payload: action
})
export const clearFeatureFilter = () => ({
  type: types.CLEAR_FEATURE_FILTER
})

// secondaryMap
export const setIsLoading2 = action => ({
  type: types.SET_ISLOADING_2,
  payload: action
})

export const setLongitude2 = action => ({
  type: types.SET_LONGITUDE_2,
  payload: action
})
export const setLatitude2 = action => ({
  type: types.SET_LATITUDE_2,
  payload: action
})
export const setZoom2 = action => ({
  type: types.SET_ZOOM_2,
  payload: action
})
export const setBoundary2 = action => ({
  type: types.SET_BOUNDARY_2,
  payload: action
})

export const setCellSize2 = action => ({
  type: types.SET_CELLSIZE_2,
  payload: action
})

export const addGridData2 = action => ({
  type: types.ADD_GRID_DATA_2,
  payload: action
})
export const clearGridData2 = () => ({
  type: types.CLEAR_GRID_DATA_2
})
export const addSelectedData2 = action => ({
  type: types.ADD_SELECTED_DATA_2,
  payload: action
})
export const clearSelectedData2 = () => ({
  type: types.CLEAR_SELECTED_DATA_2
})
export const setPanelData2 = action => ({
  type: types.SET_PANEL_DATA_2,
  payload: action
})
export const setTooltip2 = action => ({
  type: types.SET_TOOLTIP_2,
  payload: action
})
export const setPopup2 = action => ({
  type: types.SET_POPUP_2,
  payload: action
})

export const setTimeFilter2 = action => ({
  type: types.SET_TIMEFILTER_2,
  payload: action
})
export const setFeatureFilter2 = action => ({
  type: types.SET_FEATURE_FILTER_2,
  payload: action
})
export const clearFeatureFilter2 = () => ({
  type: types.CLEAR_FEATURE_FILTER_2
})