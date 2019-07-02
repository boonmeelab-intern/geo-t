import React, { useState, useRef } from "react"
import DeckGL, { GridLayer, PathLayer } from "deck.gl"
import ReactMapGL from "react-map-gl"
import _ from 'lodash'
import { circle, point, distance } from '@turf/turf'

import MapSwitcher from "./map-switcher"
import SelectionSwitcher from "./selection-switcher"
import SelectionController from "./selection-controller"
import TooltipLayer from "./tooltip-layer"

import "../scss/map-container.module.scss"

const MAPBOX_ACCESS_TOKEN =
  process.env.MapboxAccessToken || "set token on env variable"

function getColorValue(points, upperBound) {
  return points[0].weight > upperBound ? upperBound : points[0].weight
}

function mergeRects(rects, width) {
  if (rects.length === 0) {
    return []
  }

  const top_left = d => [d[0] - width * 0.05, d[1] + width * 0.3]
  const top_right = d => [d[0] + width * 0.9, d[1] + width * 0.3]
  const bot_left = d => [d[0] - width * 0.05, d[1] - width * 0.6]
  const bot_right = d => [d[0] + width * 0.9, d[1] - width * 0.6]

  const origin = [Math.min(...rects.map(c => c.position[0])), Math.min(...rects.map(c => c.position[1]))]
  const relativeRects = rects.map(r => ({ ...r, relativePos: r.position.map((p, i) => Math.round((p - origin[i]) / width)) }))

  const selectionGroup = {}
  relativeRects.forEach(r => {
    if (!selectionGroup[r.relativePos[0]]) {
      selectionGroup[r.relativePos[0]] = {}
    }

    selectionGroup[r.relativePos[0]][r.relativePos[1]] = true
  })

  const lines = []

  relativeRects.forEach(r => {
    // top neightbor
    if (!selectionGroup[r.relativePos[0]][r.relativePos[1] + 1]) {
      lines.push([top_left(r.position), top_right(r.position)])
    }
    // south neighbor
    if (!selectionGroup[r.relativePos[0]][r.relativePos[1] - 1]) {
      lines.push([bot_left(r.position), bot_right(r.position)])
    }
    // west neighbor
    if (!selectionGroup[r.relativePos[0] - 1] || !selectionGroup[r.relativePos[0] - 1][r.relativePos[1]]) {
      lines.push([top_left(r.position), bot_left(r.position)])
    }
    // east neighbor
    if (!selectionGroup[r.relativePos[0] + 1] || !selectionGroup[r.relativePos[0] + 1][r.relativePos[1]]) {
      lines.push([top_right(r.position), bot_right(r.position)])
    }
  })

  return lines
}

function selectPoint({ object }, isShiftDown, selectedCells, setSelectedCells, setSelectionPath, setMode) {
  if (!object.points) return
  let selectedCellIndex = -1
  if (selectedCells) {
    selectedCellIndex = selectedCells.findIndex(
      c => Number(c.fid) === Number(object.points[0].fid)
    )
    setMode(0)
  }
  if (isShiftDown) {
    // shift-click
    if (selectedCellIndex >= 0) {
      // already selected
      selectedCells.splice(selectedCellIndex, 1)
      setSelectedCells(selectedCells)
    } else {
      setSelectedCells([...selectedCells, ...object.points])
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (selectedCellIndex >= 0) {
      // already selected
      setSelectedCells([])
    } else {
      setSelectedCells([...object.points])
    }
  }
  setSelectionPath([])
}

function selectRectangle({ object, x, y }, deckGL, selection, setSelection, selectedCells, setSelectedCells, setMode) {
  if (!selection.isEditing) {
    // no editing mode
    setSelection({
      ...selection,
      isEditing: true,
      start: { x, y },
      end: null
    })
    // setSelectedCells([])
    setSelectedCells([...object.points])
    setMode(1)
  } else {
    // in editing mode
    setSelection({
      ...selection,
      isEditing: false,
      end: { x, y }
    })
    // calculate selected cells
    const xmin = Math.min(selection.start.x, x)
    const ymin = Math.min(selection.start.y, y)
    const xmax = Math.max(selection.start.x, x)
    const ymax = Math.max(selection.start.y, y)
    const pick = {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin
    }
    const rectGrids = deckGL.current.pickObjects(pick)
    if (rectGrids) {
      const points = _.flatten(rectGrids.map(g => g.object.points))
      setSelectedCells(points)
    }
  }
}

function selectCircle({ object, x, y, coordinate }, deckGL, selection, setSelection, selectedCells, setSelectedCells, setSelectionPath, setMode) {
  if (!selection.isEditing) {
    // no editing mode
    setSelection({
      ...selection,
      isEditing: true,
      start: { x, y },
      end: null,
      coords: [coordinate]
    })
    setSelectedCells([...object.points])
    setSelectionPath([])
    setMode(2)
  } else {
    // in editing mode
    setSelection({
      ...selection,
      isEditing: false,
      end: { x, y },
      coords: [selection.coords[0], coordinate]
    })
    // create selection path
    const options = { units: 'kilometers' }
    const from = point(selection.coords[0])
    const to = point(coordinate)
    const dist = distance(from, to, options)
    const c = circle(from, dist, options)
    setSelectionPath(c.geometry.coordinates)
    // calculate selected cells
    const xdiff = selection.start.x - x
    const ydiff = selection.start.y - y
    const radius = Math.sqrt(xdiff * xdiff + ydiff * ydiff)
    const pick = {
      x: selection.start.x,
      y: selection.start.y,
      radius,
      depth: 2000
    }
    const circleGrids = deckGL.current.pickMultipleObjects(pick)
    if (circleGrids) {
      const points = _.flatten(circleGrids.map(g => g.object.points))
      setSelectedCells(points)
    }
  }
}

/**
 * @param {object} props
 * @param {object} props.data
 */
export default function MapContainer(props) {
  const selectionPreset = [
    {
      id: 0,
      label: "Point"
    },
    {
      id: 1,
      label: "Rectangle",
      isEditing: false,
      start: null,
      end: null,
      coords: []
    },
    {
      id: 2,
      label: "Circle",
      isEditing: false,
      start: null,
      end: null,
      coords: []
    }
  ]
  const mapStylePreset = [
    {
      id: 0,
      label: "Map",
      source: "mapbox://styles/mooktdmp/cjuxtz78p02n51fobhcrya5zx"
    },
    {
      id: 1,
      label: "Satellite",
      source: "mapbox://styles/mooktdmp/cjub2irn32qew1fp7exx3jhal"
    }
  ]

  const deckGL = useRef(null)

  const [viewport, setViewport] = useState({
    latitude: 13.7525,
    longitude: 100.494167,
    zoom: 12,
    pitch: 0,
    bearing: 0
  })
  const [mapstate, setMapstate] = useState({
    cellSize: 243,
    isShiftDown: false
  })

  const [selection, setSelection] = useState(selectionPreset[0])
  const [mapStyle, setMapStyle] = useState(mapStylePreset[0])
  const [selectionPath, setSelectionPath] = useState([])
  const [mode, setMode] = useState([])

  const upperBound =
    props.locations[Math.round((props.locations.length * 99) / 100)].weight

  // const scatterPlot = new ScatterplotLayer({
  //   id: "scatterplot-layer",
  //   data: props.locations,
  //   opacity: 0.1,
  //   stroked: false,
  //   filled: true,
  //   radiusScale: 6,
  //   radiusMinPixels: 2,
  //   lineWidthMinPixels: 1,
  //   getPosition: d => d.position,
  //   getFillColor: [200, 0, 200],
  // })

  const getBoundedColorValue = p => {
    if (props.selectedCells.length > 0) {
      if (props.selectedCells.find(c => Number(c.fid) === Number(p[0].fid))) {
        return getColorValue(p, upperBound)
      }
      return 0
    }
    return getColorValue(p, upperBound)
  }

  const grid = new GridLayer({
    id: "grid-layer",
    data: props.locations,
    colorRange: [
      [68, 150, 194],
      [107, 180, 189],
      [148, 206, 167],
      [193, 232, 148],
      [224, 243, 133],
      [254, 255, 116],
      [255, 225, 109],
      [255, 188, 100],
      [255, 143, 93],
      [238, 79, 83]
    ],
    opacity: 0.2,
    // opacity: 0.65,
    // parameters: {
    //   // blendFunc: [GL.SRC_ALPHA, GL.ZERO],
    //   blendFunc: [GL.ONE_MINUS_SRC_ALPHA, GL.SRC_COLOR],
    // },
    pickable: true,
    autoHighlight: true,
    extruded: false,
    cellSize: mapstate.cellSize,
    getColorValue: getBoundedColorValue,
    getPosition: d => d.position,
    onClick: (info) => {
      const { selectedCells, updateViewSelection } = props
      const viewSelectionUpdater = cells => updateViewSelection(cells, mapstate.cellSize)

      switch (selection.id) {
        case 0: // point
          selectPoint(info, mapstate.isShiftDown, selectedCells, viewSelectionUpdater, setSelectionPath, setMode)
          break

        case 1: // rectangle
          selectRectangle( info, deckGL, selection, setSelection, selectedCells, viewSelectionUpdater, setMode)
          break

        case 2: // circle
          selectCircle( info, deckGL, selection, setSelection, selectedCells, viewSelectionUpdater, setSelectionPath, setMode)
          break

        default:
          break
      }

      // props.setLayerProps({
      //   highlightedObjectIndex: object.index,
      // })
    }
  })

  const path = new PathLayer({
    id: "path-layer",
    data: mergeRects(props.selectedCells, mapstate.cellSize / 100000),
    widthUnits: "pixels",
    rounded: true,
    getWidth: _ => 5,
    getColor: _ => [255, 255, 255],
    getPath: d => d
  })

  const selectionPathLayer = new PathLayer({
    id: "selection-layer",
    data: selectionPath,
    widthUnits: "pixels",
    rounded: true,
    getWidth: () => 2,
    getColor: () => [255, 255, 255],
    getPath: d => d
  })

  function getTooltipPosition(position, mode) {
    const cells = props.selectedCells
    var newPos

    switch (mode) {
      case 0: // point
        newPos = [position[0] + 0.00105, position[1] + 0.00105]
        break

      case 1: // rectangle
      case 2: // circle
        const minX = cells.reduce((min, d) => Math.min(min, d.position[0]), 9999999)
        const maxX = cells.reduce((max, d) => Math.max(max, d.position[0]), -9999999)
        const maxY = cells.reduce((max, d) => Math.max(max, d.position[1]), -9999999)

        newPos = [(minX + maxX) / 2 + 0.00105, maxY + 0.00105]
        break

      default:
        break
    }

    return newPos
  }
  const tooltipHeader =
    props.selectedCells.length > 0
      ? props.selectedCells.length > 1
        ? `${props.selectedCells.length} Grids Selected`
        : `ID: ${props.selectedCells[0].fid}`
      : ""
  const tooltipLocation = "Siam, Bangkok"

  function getTooltipCell(cells) {
    return cells.length > 0 ? [cells[0]] : []
  }

  const tooltipImage = "./images/tooltip.png"

  const tooltip = new TooltipLayer({
    id: "tooltip-layer",
    data: getTooltipCell(props.selectedCells),
    getPosition: d => getTooltipPosition(d.position, mode),
    getIcon: () => ({
      url: tooltipImage,
      width: 540,
      height: 225,
      anchorY: 225
    }),
    getIconSize: 100,

    // header text
    getHeaderText: () => tooltipHeader,
    getHeaderTextSize: () => 20,
    getHeaderTextColor: () => [0, 0, 0, 255],
    getHeaderPixelOffset: () => [0, -60],

    // location text
    getLocationText: () => tooltipLocation,
    getLocationTextSize: () => 20,
    getLocationTextColor: () => [128, 128, 128, 255],
    getLocationPixelOffset: () => [0, -30]
  })

  return (
    <div className="map-container">
      <DeckGL
        ref={deckGL}
        initialViewState={viewport}
        controller={SelectionController}
        layers={[grid, path, selectionPathLayer, tooltip]}
        onViewStateChange={({ viewState, interactionState, oldViewState }) => {
          setMapstate({
            ...mapstate,
            isShiftDown: interactionState.isShiftDown,
            cellSize: props.selectedCells.length > 0 ? 
              mapstate.cellSize : 
                viewState.zoom < 11 ? 972 : 
                viewState.zoom < 12 ? 486 : 243
          })
        }}
      >
        <ReactMapGL
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle={mapStyle.source}
          {...viewport}
          onViewportChange={vp => {
            setViewport(vp)
          }}
        />
      </DeckGL>
      <div
        className="switcher-container"
      >
        <SelectionSwitcher
          selectionPreset={selectionPreset}
          selection={selection.id}
          onToggle={() =>
            setSelection(
              selectionPreset[(selection.id + 1) % selectionPreset.length]
            )
          }
        />
      </div>
      <div
        className="map-switcher-container"
      >
        <MapSwitcher
          mapStylePreset={mapStylePreset}
          activeId={mapStyle.id}
          onToggle={() =>
            setMapStyle(
              mapStylePreset[(mapStyle.id + 1) % mapStylePreset.length]
            )
          }
        />
      </div>
    </div>
  )
}
