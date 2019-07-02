import React, { Component } from 'react'

export default class TimeFilterTemplate extends Component {
    state = {
        open: false
    }

    onClick = () => {
        const currentState = this.state.open
        this.setState({ open: !currentState })
    }

    render() {
        const { parentClass, title, details, children } = this.props
        return (
            <div className={this.state.open ? `${parentClass} open` : parentClass }>
                <div 
                className="time-filter-header"
                onClick={this.onClick}
                >
                    <span className="title">{title}</span>
                    <span className="details">{details}</span>
                </div>
                <div className="time-filter-content">{children}</div>
            </div>
        )
    }
}