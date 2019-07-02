import React from "react"

import "../scss/map-switcher.module.scss"

/**
 * @function MapSwitcher
 * @description Render card with it's content
 * @param {Array} mapStylePreset Array of map style
 * @param {Number} activeId Id of active map style
 * @param {Function} onToggle Function to be trigger when map style is toggled
 * @return {React.Component}
 */
export default function MapSwitcher({ mapStylePreset, activeId, onToggle }) {
  return (
    <div className="switcher">
      {mapStylePreset.map(m => (
        <button
          key={m.id}
          className={activeId !== m.id ? "inactive" : ""}
          onClick={() => m.id !== activeId && onToggle(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
