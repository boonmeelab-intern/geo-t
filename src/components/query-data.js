import store from '../store'
import * as actions from '../actions'

const datePadding = num => (Math.floor(Math.abs(num)) < 10 ? '0' : '') + Math.floor(Math.abs(num))
const convertDateToISO = date => `${date.getFullYear()}-${datePadding(date.getMonth() + 1)}-${datePadding(date.getDate())}T${datePadding(date.getHours())}:${datePadding(date.getMinutes())}:${datePadding(date.getSeconds())}.000Z`

export const queryGridData = mapKey => {
  const dateAvailable = process.env.LastAvailableDate
  const { featureFilter } = store.getState()[mapKey]
  const { zoom, boundary } = store.getState()[mapKey].viewState
  const { dateStart, dateEnd, dayOfWeek, timeStart, timeEnd } = store.getState()[mapKey].timeFilter
  const url = process.env.GridDataAPI
  const dateStartIso = dateStart ? convertDateToISO(dateStart) : dateAvailable
  const dateEndIso = dateEnd ? convertDateToISO(dateEnd) : dateAvailable
  const zoomOffset = parseInt(zoom, 10) + 2
  const zoomInvert = zoomOffset - ( 2 * ( zoomOffset - 11 ))
  const data = {
    "viewport-boundary": {
         "lng-bound": boundary.lngBound,
         "lat-bound": boundary.latBound
     },
     "time-filter": {
         "date-start": dateStartIso,
         "date-end": dateEndIso,
        "day-of-week": dayOfWeek,
        "time-start": timeStart,
        "time-end": timeEnd
     },
     "feature-filter": featureFilter,
    zoom: zoomInvert
  }

  if (mapKey === 'mainMap') {
    store.dispatch(actions.setIsLoading(true))
  }
  if (mapKey === 'secondaryMap') {
    store.dispatch(actions.setIsLoading2(true))
  }
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => {
    if (mapKey === 'mainMap') {
      store.dispatch(actions.clearGridData())
      json.map(key => {
        store.dispatch(actions.addGridData(key))
      })
      store.dispatch(actions.setIsLoading(false))
    }
    if (mapKey === 'secondaryMap') {
      store.dispatch(actions.clearGridData2())
      json.map(key => {
        store.dispatch(actions.addGridData2(key))
      })
      store.dispatch(actions.setIsLoading2(false))
    }
  })
}

export const queryDataViz = mapKey => {
  const dateAvailable = process.env.LastAvailableDate
  const { featureFilter, selectedData } = store.getState()[mapKey]
  const { dateStart, dateEnd, dayOfWeek, timeStart, timeEnd } = store.getState()[mapKey].timeFilter
  const url = process.env.DataVizAPI
  const dateStartIso = dateStart ? convertDateToISO(dateStart) : dateAvailable
  const dateEndIso = dateEnd ? convertDateToISO(dateEnd) : dateAvailable
  const fids = []

  selectedData.map(list => {
    fids.push(list.fid)
  })

  const data = {
    fids,
    "time-filter": {
      "date-start": dateStartIso,
      "date-end": dateEndIso,
      "day-of-week": dayOfWeek,
      "time-start": timeStart,
      "time-end": timeEnd
    },
    "feature-filter": featureFilter
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => {
    if (!json.hasOwnProperty('error')) {
      if (mapKey === 'mainMap') {
        store.dispatch(actions.setPanelData(json))
      }
      if (mapKey === 'secondaryMap') {
        store.dispatch(actions.setPanelData2(json))
      }
    }
  })
}