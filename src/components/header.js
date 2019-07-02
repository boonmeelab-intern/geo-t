import PropTypes from "prop-types"
import React from "react"

import "../scss/header.scss"

const Header = ({ siteTitle, onCompareToggle }) => (
  <header className="site-header">
    <div className="container">
      <div style={{ flex: 1 }}>
        <h1 className="site-title">
          <a href="/">
            {siteTitle}
          </a>
        </h1>
      </div>
      <div>
        <button className="site-title" onClick={onCompareToggle}>
          Split
        </button>
      </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string
}

Header.defaultProps = {
  siteTitle: `Site Title`
}

export default Header
