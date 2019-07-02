import React, { Component } from 'react'
import { connect } from 'react-redux'
import { queryGridData } from './query-data'
import store from '../store'
import * as actions from '../actions'

import '../scss/side-panel.scss'

const mapState = state => ({
  mainMap: state.mainMap,
  secondaryMap: state.secondaryMap
})

const featureOption = [
  {
    featureId: "age_group",
    featureName: "Age",
    values: [
      { label: "N/A", value: "NA" },
      { label: "< 20", value: "1_19" },
      { label: "20-29", value: "20_29" },
      { label: "30-39", value: "30_39" },
      { label: "40-49", value: "40_49" },
      { label: "50-59", value: "50_59" },
      { label: ">= 60", value: "age_more_than_60" }
    ]
  },
  {
    featureId: "customer_type",
    featureName: "Post / Prepaid",
    values: [
      { label: "N/A", value: "NA" },
      { label: "Postpaid", value: "POST" },
      { label: "Prepaid", value: "PREP" }
    ]
  },
  {
    featureId: "monthly_payment",
    featureName: "Monthly Payment",
    values: [
      { label: "N/A", value: "NA" },
      { label: "No Payment", value: "0.No payment" },
      { label: "0-99", value: "1.Pay_0to99" },
      { label: "100-199", value: "2.Pay_100to199" },
      { label: "200-599", value: "3.Pay_200to599" },
      { label: "600-999", value: "4.Pay_600to999" },
      { label: ">= 1000", value: "5.Pay_1000+" }
    ]
  },
  {
    featureId: "handset_type",
    featureName: "Handset Type",
    values: [
      { label: "N/A", value: "NA" },
      { label: "Apple", value: "Apple" },
      { label: "Feature phone", value: "Feature phone" },
      { label: "Huawei", value: "Huawei" },
      { label: "Oppo", value: "Oppo" },
      { label: "Samsung", value: "Samsung" },
      { label: "Smartphone Others", value: "Smartphone Others" },
      { label: "Vivo", value: "Vivo" }
    ]
  },
  {
    featureId: "data_usage",
    featureName: "Data Usage",
    values: [
      { label: "0 MB", value: "0 MB" }
    ]
  },
  {
    featureId: "customer_segment",
    featureName: "Segmentation",
    values: [
      { label: "Resident", value: "resident" },
      { label: "Visitor", value: "visitor" },
      { label: "Worker", value: "worker" }
    ]
  },
  {
    featureId: "social_facebook",
    featureName: "Facebook",
    values: [
      { label: "False", value: "0" },
      { label: "True", value: "1" }
    ]
  },
  {
    featureId: "social_line",
    featureName: "Line",
    values: [
      { label: "False", value: "0" },
      { label: "True", value: "1" }
    ]
  },
  {
    featureId: "social_instagram",
    featureName: "Instagram",
    values: [
      { label: "False", value: "0" },
      { label: "True", value: "1" }
    ]
  },
  {
    featureId: "social_twitter",
    featureName: "Twitter",
    values: [
      { label: "False", value: "0" },
      { label: "True", value: "1" }
    ]
  },
  {
    featureId: "social_linkedin",
    featureName: "Linkedin",
    values: [
      { label: "False", value: "0" },
      { label: "True", value: "1" }
    ]
  },
  {
    featureId: "music_lover",
    featureName: "Music Lover",
    values: [
      { label: "False", value: "0" },
      { label: "True", value: "1" }
    ]
  },
  {
    featureId: "coffee_lover",
    featureName: "Coffee Lover",
    values: [
      { label: "False", value: "0" }
    ]
  },
  {
    featureId: "travel_lover",
    featureName: "Travel Lover",
    values: [
      { label: "False", value: "0" },
      { label: "True", value: "1" }
    ]
  }
]

class FeatureFilter extends Component {
  state = {
    mapKey: '',
    open: false,
    feature_filter: {}
  }

  componentWillMount = () => {
    const { mapKey } = this.props
    // create feature option state
    const { feature_filter } = this.state
    featureOption.map(({ featureId }) => {
      feature_filter[featureId] = { open: false, status: false, selection: [] }
    })
    this.setState({ mapKey, feature_filter })
  }

  generateFeatureButton = () => featureOption.map(({ featureId, featureName }) => [
    <div className={this.state.feature_filter[featureId].status ? "feature-form active" : "feature-form"} key={featureId}>
      <input className="form-input" type="radio" name={`${this.state.mapKey}_feature`} id={`${this.state.mapKey}_${featureId}`} value={featureId} onChange={e => this._onFeatureChange(e)} />
      <label className="form-label" htmlFor={`${this.state.mapKey}_${featureId}`}>{featureName}</label>
    </div>
  ])

  generateFeatureOption = () => featureOption.map(({ featureId, values }) => [
    <div className={this.state.feature_filter[featureId].open ? `${featureId} open` : featureId} key={featureId}>
      {values.map((list, index) => {
        const key = `${featureId}_${index}`
        return (
          <div className="feature-option-form" key={key}>
            <input className="form-input" type="checkbox" name={`${this.state.mapKey}_${featureId}`} id={`${this.state.mapKey}_${key}`} value={list.value} onChange={() => this._onFeatureOptionChange(featureId, `${this.state.mapKey}_${featureId}`)} />
            <label className="form-label" htmlFor={`${this.state.mapKey}_${key}`}>{list.label}</label>
          </div>
        )
      })}
    </div>
  ])

  uncheckAllFeatureFilter = () => {
    const { mapKey, feature_filter } = this.state

    Object.keys(feature_filter).map(key => {
      const checkboxName = Array.from(document.getElementsByName(`${mapKey}_${key}`))
      checkboxName.map(e => {
        e.checked = false
      })
      this._onFeatureOptionChange(key)
    })
  }

  updateFromStore = () => {
    this.uncheckAllFeatureFilter()

    const { mapKey, feature_filter } = this.state
    const { featureFilter } = store.getState()[mapKey]

    Object.keys(feature_filter).map(key => {
      // check if selected key were in store
      if (key in featureFilter) {
        const select = featureFilter[key]
        // obtains the value array of selected key
        let currentKey
        featureOption.map(featureKey => {
          if (featureKey.featureId === key) {
            currentKey = featureKey.values
          }
        })
        // check a key's checkbox rely on selection from store
        select.map(list => {
          const index = currentKey.map(k => k.value).indexOf(list)
          const toCheck = `${mapKey}_${key}_${index}`
          document.getElementById(toCheck).checked = true;
        })
      }
      this._onFeatureOptionChange(key, `${mapKey}_${key}`)
    })
  }

  _onClick = () => {
    const currentState = this.state.open
    this.setState({ open: !currentState })
  }

  _onFeatureChange = e => {
    const { feature_filter } = this.state
    const { value } = e.target

    // clear feature selection state
    Object.keys(feature_filter).map((key) => {
      feature_filter[key].open = false
    })

    // set feature selection state
    feature_filter[value].open = true
    this.setState({ feature_filter })
  }

  _onFeatureOptionChange = (id, el) => {
    const feature_filter = { ...this.state.feature_filter }
    const checkbox = Array.from(document.getElementsByName(el))
    const select = []
    let status = false
    checkbox.map(e => {
      if (e.checked) {
        select.push(e.value)
        status = true
      }
    })
    feature_filter[id].status = status
    feature_filter[id].selection = select
    this.setState({ feature_filter })
  }

  _undoChanged = () => {
    this.updateFromStore()
  }

  _applyChanged = () => {
    const { mapKey, feature_filter } = this.state
    const featureFilter = {}

    Object.keys(feature_filter).map(key => {
      const { selection } = feature_filter[key]
      if (key !== 'open' && selection && selection.length > 0) {
        featureFilter[key] = selection
      }
    })
    if (mapKey === 'mainMap') {
      store.dispatch(actions.setFeatureFilter(featureFilter))
    }
    if (mapKey === 'secondaryMap') {
      store.dispatch(actions.setFeatureFilter2(featureFilter))
    }
    queryGridData(mapKey)
    this.setState({ open: false })
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={this.state.open ? "panel-obj feature-filter open" : "panel-obj feature-filter"}
        >
          <div
            className="panel-obj-header"
            onClick={this._onClick}
          >
            <img src="./images/filter.png" alt="icon" />
            <span className="title">Feature Filter</span>
            {this.state.open}
          </div>
          <div className="panel-obj-content">
            <h3>Features</h3>
            <button className="clearFilter" onClick={this.uncheckAllFeatureFilter}>Clear All</button>
            <div className="container">
              <div className="features">
                {this.generateFeatureButton()}
              </div>
              <div className="options">
                {this.generateFeatureOption()}
              </div>
            </div>
            <div className="groupButton">
              <button className="undo" onClick={this._undoChanged}>Cancel</button>
              <button className="submit" onClick={this._applyChanged}>Apply</button>
            </div>
          </div>
        </div>
      </React.Fragment>

    )
  }
}

export default connect(mapState)(FeatureFilter)