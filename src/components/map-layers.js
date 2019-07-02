import { GridLayer, PathLayer } from 'deck.gl'

const generateGridDensity = object => {
  const density = object.reduce((total, el) => total + el.density, 0)
  return density
}

export default function renderLayers(props) {
  const { gridData, selectedData, zoom, onHover, onClick, layerSettings, colorRange } = props
  return [
    (selectedData.length > 0 && selectedData[0].zoom === zoom) &&
      new PathLayer({
        id: 'selectedGrid',
        data: selectedData,
        fp64: true,
        getPath: d => d.path,
        getWidth: 30,
        getColor: [65, 165, 241, 255]
      }),
    new GridLayer({
      id: 'grid',
      data: gridData,
      pickable: true,
      extruded: false,
      coverage: 0.95,
      opacity: 0.1,
      colorRange,
      autoHighlight: true,
      fp64: true,
      gpuAggregation: true,
      highlightColor: [255, 255, 255, 150],
      getPosition: d => d.coordinates,
      getColorValue: points => generateGridDensity(points),
      onHover,
      onClick,
      ...layerSettings
    })
  ]
}