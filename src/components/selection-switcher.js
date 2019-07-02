import React from "react"

import "../scss/selection-switcher.module.scss"

export default function SelectionSwitcher(props) {
  return (
    <div className="switcher">
      {props.selectionPreset.map(m => (
        <button
          key={m.id}
          className={
            props.selection !== m.id ? "inactive" : ""
          }
          onClick={() => m.id !== props.selection && props.onToggle(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
