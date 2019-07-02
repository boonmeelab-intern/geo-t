import React from "react"

/**
 * @function Card
 * @description Render card with it's content
 * @param {HTMLElement} children Element to be rendered as a content
* @param {Boolean} isFloating Set floating/docking position of the panel
 * @param {Object} style Custom style to be added to the card
 * @return {React.Component}
 */
export default function Card({ children, isFloating, style }) {
  const basicStyle = {
    backgroundColor: "white",
    padding: "12px",
    position: "relative"
  }

  const floatingStyle = {
    margin: "6px",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.21)"
  }

  const dividerStyle = {
    height: "1px",
    backgroundColor: "rgba(0,0,0,0.07)",
    position: "absolute",
    bottom: 0,
    right: "12px",
    left: "12px"
  }

  return (
    <div
      style={{ ...basicStyle, ...(isFloating ? floatingStyle : {}), ...style }}
    >
      {children}
      {!isFloating && <div style={dividerStyle} />}
    </div>
  )
}
