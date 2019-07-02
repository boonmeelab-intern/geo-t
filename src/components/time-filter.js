import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DateRangePicker } from 'react-date-range'
import InputRange from 'react-input-range'

import store from '../store'
import * as actions from '../actions'
import { queryGridData } from './query-data'
import TimeFilterOption from './templates/time-filter-template'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'react-input-range/lib/css/index.css'
import '../scss/side-panel.scss'

const mapState = state => ({
  mainMap: state.mainMap,
  secondaryMap: state.secondaryMap
})

const dateRadioOption = [
  { name: "Last 7 Days", value: 7 },
  { name: "Last 30 Days", value: 30 },
  { name: "Last 3 Months", value: 90 },
  { name: "Last 6 Months", value: 180 },
  { name: "Last 12 Months", value: 360 },
  { name: "Custom", value: 0 }
]

const dayOfWeekOption = [
  { name: "Sunday", short: "Sun", value: 0 },
  { name: "Monday", short: "Mon", value: 1 },
  { name: "Tuesday", short: "Tue", value: 2 },
  { name: "Wednesday", short: "Wed", value: 3 },
  { name: "Thursday", short: "Thu", value: 4 },
  { name: "Friday", short: "Fri", value: 5 },
  { name: "Saturday", short: "Sat", value: 6 }
]

const setOfDay = [
  { name: "Everyday", value: [0, 1, 2, 3, 4, 5, 6] },
  { name: "Weekday", value: [1, 2, 3, 4, 5] },
  { name: "Weekend", value: [0, 6] }
]

const setOfTime = [
  { name: "All Day", value: { min: 0, max: 24 } },
  { name: "Morning Commute", value: { min: 7, max: 10 } },
  { name: "Lunch Hour", value: { min: 12, max: 13 } },
  { name: "Evening Commute", value: { min: 17, max: 19 } }
]

const arrayComparison = (arr1, arr2) => {
  if (!arr1 || !arr2) {
    return false
  }
  if (arr1.length !== arr2.length) {
    return false
  }
  for (var i = 0, l = arr1.length; i < l; i++) {
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      if (!arr1[i].equals(arr2[i])) {
        return false
      }
    } else if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true;
}

class TimeFilter extends Component {
  state = {
    mapKey: '',
    open: false,
    changed: false,
    date_interval: {
      title: null,
      detail: null,
      selecting: null,
      start: null,
      end: null
    },
    calendar: {
      show: false,
      start: null,
      end: null
    },
    day_of_week: {
      title: null,
      detail: null,
      selecting: null
    },
    time_interval: {
      title: null,
      detail: null,
      selecting: {
        min: null,
        max: null
      }
    }
  }

  componentWillMount() {
    const { mapKey } = this.props
    this.setState({ mapKey }, () => {
      this.timeFilterToStore()
    })
  }

  componentDidMount() {
    this._getFormInputActive()
  }

  timeFilterToStore = () => {
    const { mapKey } = this.state
    const { timeFilter } = this.props[mapKey]
    const dateIntervalSelected = (this.state.date_interval.selecting === null) ? timeFilter.dateIntervalSelected : parseInt(this.state.date_interval.selecting, 10)
    const dateEnd = (parseInt(dateIntervalSelected, 10) !== 0) ? new Date(process.env.LastAvailableDate) : this.state.date_interval.end
    const dateEndTimestamp = new Date(process.env.LastAvailableDate)
    const dateStart = (parseInt(dateIntervalSelected, 10) !== 0) ? new Date(dateEndTimestamp.getTime() - ((dateIntervalSelected - 1) * 24 * 60 * 60 * 1000)) : this.state.date_interval.start
    const dayOfWeek = (this.state.day_of_week.selecting === null) ? timeFilter.dayOfWeek : this.state.day_of_week.selecting
    const timeStart = (this.state.time_interval.selecting.min === null) ? timeFilter.timeStart : this.state.time_interval.selecting.min
    const timeEnd = (this.state.time_interval.selecting.max === null) ? timeFilter.timeEnd : this.state.time_interval.selecting.max
    if (mapKey === 'mainMap') {
      store.dispatch(actions.setTimeFilter({ dateIntervalSelected, dateStart, dateEnd, dayOfWeek, timeStart, timeEnd }))
    }
    if (mapKey === 'secondaryMap') {
      store.dispatch(actions.setTimeFilter2({ dateIntervalSelected, dateStart, dateEnd, dayOfWeek, timeStart, timeEnd }))
    }
    this._getDateIntervalToState()
    this._getDayOfWeekToState()
    this._getTimeIntervalToState()
    
    queryGridData(mapKey)
  }

  generateDateRadio = () => dateRadioOption.map(({ name, value }) => {
    const id = `dateInterval_${value}`
    return [
      <div className="date-form" key={value}>
        <input className="form-input" type="radio" name="dateInterval" id={id} value={value} onChange={e => this._onDateIntervalChange(e)} />
        <label className="form-label" htmlFor={id}>{name}</label>
      </div>
    ]
  })

  generateDayCheckbox = () => dayOfWeekOption.map(({ name, value }) => {
    const id = `dayOfWeek_${value}`
    return [
      <div className="day-form" key={value}>
        <input className="form-input" type="checkbox" name="dayOfWeek" id={id} value={value} onChange={this._onDayOfWeekChange} />
        <label className="form-label" htmlFor={id}>{name}</label>
      </div>
    ]
  })

  generateDayOfWeekButton = () => setOfDay.map(({ name, value }) => [
    <button className="day-of-week-button" key={name} onClick={() => this._onDayOfWeekSetActive(value)}>{name}</button>
  ])

  generateTimeIntervalButton = () => setOfTime.map(({ name, value }) => [
    <button className="time-inverval-button" key={name} onClick={() => this._onTimeIntervalChange(value)}>{name}</button>
  ])

  _getDateIntervalToState = () => {
    const { mapKey } = this.state
    const dateInterval = { ...this.state.date_interval }

    // Date Interval Title
    const { dateIntervalSelected } = store.getState()[mapKey].timeFilter
    dateRadioOption.map(({ name, value }) => {
      if (parseInt(dateIntervalSelected, 10) === parseInt(value, 10)) {
        dateInterval.title = name
      }
    })

    // Date Interval Start/End
    const { dateStart, dateEnd } = store.getState()[mapKey].timeFilter
    dateInterval.start = dateStart
    dateInterval.end = dateEnd

    // Date Interval Details
    const monthStart = new Date(dateStart).toLocaleString('en-us', { month: 'short' })
    const monthEnd = new Date(dateEnd).toLocaleString('en-us', { month: 'short' })
    dateInterval.detail = `${new Date(dateStart).getDate()} ${monthStart} ${new Date(dateStart).getFullYear()} - ${new Date(dateEnd).getDate()} ${monthEnd} ${new Date(dateEnd).getFullYear()}`

    this.setState({ date_interval: dateInterval })
  }

  _getDayOfWeekToState = () => {
    const { mapKey } = this.state
    // Day of week selection
    const day_of_week = { ...this.state.day_of_week }
    const { dayOfWeek } = store.getState()[mapKey].timeFilter
    day_of_week.selecting = dayOfWeek

    // Day of week Title
    day_of_week.title = 'Untitled'
    setOfDay.map(({ name, value }) => {
      if (arrayComparison(day_of_week.selecting, value)) {
        day_of_week.title = name
      }
    })

    // Day of week Detail
    let dayOfWeek_detail = ''
    dayOfWeekOption.map(({ name, short, value }) => {
      dayOfWeek_detail += (day_of_week.selecting.includes(value)) ? `${short} ` : ''
    })
    day_of_week.detail = dayOfWeek_detail

    this.setState({ day_of_week })
  }

  _getTimeIntervalToState = () => {
    const { mapKey } = this.state
    const time_interval = { ...this.state.time_interval }
    const { timeStart } = store.getState()[mapKey].timeFilter
    const { timeEnd } = store.getState()[mapKey].timeFilter

    const title = `${timeStart.toFixed(2)} - ${timeEnd.toFixed(2)}`
    const duration = parseInt(timeEnd, 10) - parseInt(timeStart, 10)
    const detail = `${duration} ${(duration > 1) ? 'Hours' : 'Hour'}`
    time_interval.title = title
    time_interval.detail = detail
    time_interval.selecting.min = timeStart
    time_interval.selecting.max = timeEnd

    this.setState({ time_interval })
  }

  _getFormInputActive = () => {
    const { mapKey } = this.state
    const { timeFilter } = this.props[mapKey]

    // Date Interval
    const dateIntervalId = `dateInterval_${timeFilter.dateIntervalSelected}`
    document.getElementById(dateIntervalId).checked = true;

    // Day of Week
    const { dayOfWeek } = timeFilter
    dayOfWeek.map(value => {
      const dayOfWeekId = `dayOfWeek_${value}`
      document.getElementById(dayOfWeekId).checked = true;
    })
  }

  _onClick = () => {
    const currentState = this.state.open
    this.setState({ open: !currentState })
  }

  _closeCalendar = () => {
    const calendar = { ...this.state.calendar }
    calendar.show = false
    this.setState({ calendar })
  }

  _onCalendarApply = () => {
    const date_interval = { ...this.state.date_interval }
    date_interval.start = this.state.calendar.start
    date_interval.end = this.state.calendar.end
    date_interval.selecting = 0
    this.setState({ date_interval })
    this._onFilterChanged()
    this._closeCalendar()
  }

  _onCalendarChange = range => {
    const calendar = { ...this.state.calendar }
    calendar.start = range.selection.startDate
    calendar.end = range.selection.endDate
    this.setState({ calendar })
  }

  _onDateIntervalChange = e => {
    const { value } = e.target
    if (parseInt(value, 10) === 0) {
      const calendar = { ...this.state.calendar }
      calendar.show = true
      calendar.start = this.state.date_interval.start
      calendar.end = this.state.date_interval.end
      this.setState({ calendar })
    } else {
      this._closeCalendar()
      const date_interval = { ...this.state.date_interval }
      date_interval.selecting = e.target.value
      this.setState({ date_interval })
      this._onFilterChanged()
    }
  }

  _onDayOfWeekChange = () => {
    const checkboxSelecting = []
    const day_of_week = { ...this.state.day_of_week }
    const checkbox = Array.from(document.getElementsByName('dayOfWeek'))
    checkbox.map(e => {
      if (e.checked) {
        checkboxSelecting.push(parseInt(e.value, 10))
      }
    })
    day_of_week.selecting = checkboxSelecting
    this.setState({ day_of_week })
    this._onFilterChanged()
  }

  _onDayOfWeekSetActive = selecting => {
    const checkbox = Array.from(document.getElementsByName('dayOfWeek'))
    checkbox.map(e => {
      e.checked = false
    })
    selecting.map(value => {
      const dayOfWeekId = `dayOfWeek_${value}`
      document.getElementById(dayOfWeekId).checked = true;
    })
    this._onDayOfWeekChange()
  }

  _onTimeIntervalChange = value => {
    const time_interval = { ...this.state.time_interval }
    time_interval.selecting = value
    this.setState({ time_interval })
    this._onFilterChanged()
  }

  _onFilterChanged = () => {
    this.setState({ changed: true })
  }

  _undoChanged = () => {
    const { mapKey } = this.state
    const { timeFilter } = this.props[mapKey]
    const date_interval = { ...this.state.date_interval }
    const day_of_week = { ...this.state.day_of_week }
    const time_interval = { ...this.state.time_interval }
    date_interval.selecting = timeFilter.dateIntervalSelected
    day_of_week.selecting = timeFilter.dayOfWeek
    time_interval.selecting.min = timeFilter.timeStart
    time_interval.selecting.max = timeFilter.timeEnd
    this._getFormInputActive()
    this.setState({ changed: false, date_interval, day_of_week, time_interval })
  }

  _applyChanged = () => {
    this.timeFilterToStore()
    this.setState({ changed: false })
  }

  render() {
    const selectionRange = {
      startDate: new Date(this.state.calendar.start),
      endDate: new Date(this.state.calendar.end),
      key: 'selection'
    }
    const { calendar } = this.state
    return (
      <React.Fragment>
        {calendar.show && (
          <div className="custom-calendar">
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={this._onCalendarChange}
              showDateDisplay={false}
              staticRanges={[]}
              inputRanges={[]}
              minDate={new Date("2019-03-01")}
              maxDate={new Date("2019-03-31")}
            />
            <div className="calendar-btn">
              <button className="undo" onClick={this._closeCalendar}>x</button>
              <button className="submit" onClick={this._onCalendarApply}>Apply</button>
            </div>
          </div>
        )}
        <div
          className={this.state.open ? "panel-obj time-filer open" : "panel-obj time-filer"}
        >
          <div
            className="panel-obj-header"
            onClick={this._onClick}
          >
            <img src="./images/calendar.png" alt="icon" />
            <span className="title">Time Filter</span>
            {this.state.open}
          </div>
          <div className="panel-obj-content">
            <div className={this.state.changed ? "update-change changed" : "update-change"}>
              <span>Apply new changed?</span>
              <button className="undo" onClick={this._undoChanged}>x</button>
              <button className="submit" onClick={this._applyChanged}>Apply</button>
            </div>
            <div className="inner">
              <TimeFilterOption
                parentClass="date-interval"
                title={this.state.date_interval.title}
                details={this.state.date_interval.detail}
              >
                {this.generateDateRadio()}
              </TimeFilterOption>
              <TimeFilterOption
                parentClass="day-of-week"
                title={this.state.day_of_week.title}
                details={this.state.day_of_week.detail}
              >
                {this.generateDayCheckbox()}
                <div className="day-of-week-set">
                  {this.generateDayOfWeekButton()}
                </div>
              </TimeFilterOption>
              <TimeFilterOption
                parentClass="time-interval"
                title={this.state.time_interval.title}
                details={this.state.time_interval.detail}
              >
                <p>Time of the Day</p>
                <div className="input-range-container">
                  {(this.state.time_interval.selecting.min !== null) && (
                    <InputRange
                      allowSameValues
                      minValue={0}
                      maxValue={24}
                      formatLabel={value => value.toFixed(2)}
                      value={this.state.time_interval.selecting}
                      onChange={value => this._onTimeIntervalChange(value)}
                    />
                  )}
                </div>
                {this.generateTimeIntervalButton()}
              </TimeFilterOption>
            </div>
          </div>
        </div>
      </React.Fragment>

    )
  }
}

export default connect(mapState)(TimeFilter)