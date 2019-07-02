import { MapController } from "deck.gl"

export default class SelectionController extends MapController {
  setProps(props) {
    super.setProps(props)
    this.toggleEvents(["keyup"], true)
  }

  handleEvent(event) {
    switch (event.type) {
      case "keyup":
        return this._onKeyDown(event, false)
      default:
        return super.handleEvent(event)
    }
  }

  _onKeyDown(event, enabled = true) {
    switch (event.srcEvent.keyCode) {
      case 16: // Shift
        const interactionState = { isShiftDown: enabled }
        const viewState = Object.assign(
          {},
          this.controllerState.getViewportProps(),
          {}
        )
        this.onViewStateChange({ viewState, interactionState })
        break
      default:
        super._onKeyDown(event)
        break
    }
  }
}
