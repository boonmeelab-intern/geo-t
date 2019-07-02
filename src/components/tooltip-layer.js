import {CompositeLayer, IconLayer, TextLayer} from 'deck.gl'

const DEFAULT_FONT_FAMILY = 'Monaco, monospace'
const DEFAULT_FONT_WEIGHT = 'normal'

const defaultProps = {
  // Shared accessors
  getPosition: {type: 'accessor', value: x => x.position},
  // Icon properties
  iconAtlas: null,
  iconMapping: {type: 'object', value: {}, async: true},
  // Icon accessors
  getIcon: {type: 'accessor', value: x => x.icon},
  getIconSize: {type: 'accessor', value: 20},
  getIconColor: {type: 'accessor', value: [0, 0, 0, 255]},

  // Text properties
  fontFamily: DEFAULT_FONT_FAMILY,
  fontWeight: DEFAULT_FONT_WEIGHT,
  getAlignmentBaseline: {type: 'accessor', value: 'bottom'},

  // Header Text accessors
  getHeaderText: {type: 'accessor', value: x => x.text},
  getHeaderTextSize: {type: 'accessor', value: 12},
  getHeaderTextColor: {type: 'accessor', value: [0, 0, 0, 255]},
  getHeaderPixelOffset: {type: 'accessor', value: x => x.pixelOffeset},

  // Location Text accessors
  getLocationText: {type: 'accessor', value: x => x.text},
  getLocationTextSize: {type: 'accessor', value: 12},
  getLocationTextColor: {type: 'accessor', value: [0, 0, 0, 255]},
  getLocationPixelOffset: {type: 'accessor', value: x => x.pixelOffeset}
}

export default class TooltipLayer extends CompositeLayer {
  renderLayers() {
    return [
      // the icons
      new IconLayer(
        this.getSubLayerProps({
          id: 'icon',
          data: this.props.data,

          iconAtlas: this.props.iconAtlas,
          iconMapping: this.props.iconMapping,

          getPosition: this.props.getPosition,
          getIcon: this.props.getIcon,
          getSize: this.props.getIconSize,
          getColor: this.props.getIconColor,

          updateTriggers: {
            getPosition: this.props.updateTriggers.getPosition,
            getIcon: this.props.updateTriggers.getIcon,
            getSize: this.props.updateTriggers.getIconSize,
            getColor: this.props.updateTriggers.getIconColor
          }
        })
      ),
      // the header labels
      new TextLayer(
        this.getSubLayerProps({
          id: 'id',
          data: this.props.data,

          fontFamily: this.props.fontFamily,
          fontWeight: this.props.fontWeight,
          getAlignmentBaseline: this.props.getAlignmentBaseline,

          getPosition: this.props.getPosition,
          getText: this.props.getHeaderText,
          getSize: this.props.getHeaderTextSize,
          getColor: this.props.getHeaderTextColor,
          getPixelOffset: this.props.getHeaderPixelOffset,

          updateTriggers: {
            getPosition: this.props.updateTriggers.getPosition,
            getText: this.props.updateTriggers.getHeaderText,
            getSize: this.props.updateTriggers.getHeaderTextSize,
            getColor: this.props.updateTriggers.getHeaderTextColor,
            getPixelOffset: this.props.updateTriggers.getHeaderPixelOffset
          }
        })
      ),
      // the location labels
      new TextLayer({
        id: 'id',
        data: this.props.data,

        fontFamily: this.props.fontFamily,
        fontWeight: this.props.fontWeight,
        getAlignmentBaseline: this.props.getAlignmentBaseline,

        getPosition: this.props.getPosition,
        getText: this.props.getLocationText,
        getSize: this.props.getLocationTextSize,
        getColor: this.props.getLocationTextColor,
        getPixelOffset: this.props.getLocationPixelOffset,

        updateTriggers: {
          getPosition: this.props.updateTriggers.getPosition,
          getText: this.props.updateTriggers.getLocationText,
          getSize: this.props.updateTriggers.getLocationTextSize,
          getColor: this.props.updateTriggers.getLocationTextColor,
          getPixelOffset: this.props.updateTriggers.getLocationPixelOffset
        }
      })
    ]
  }
}

TooltipLayer.layerName = 'TooltipLayer'
TooltipLayer.defaultProps = defaultProps
