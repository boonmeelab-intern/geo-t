import allGridSample from '../data/gridSample.json'
import merchantSample from '../data/merchantSample.json'

const binLabel = ['type A', 'type B', 'type C', 'type D']

const prePostPaidDataVizPreset = [{ label: 'Pre Paid', key: 'pct_prep_substype' }, { label: 'Post Paid', key: 'pct_post_substype' }]

const ageDataVizPreset = [
  { label: '0-18', key: 'pct_less_18_age_group' },
  { label: '18-25', key: 'pct_18_25_age_group' },
  { label: '25-33', key: 'pct_25_33_age_group' },
  { label: '33-40', key: 'pct_33_40_age_group' },
  { label: '40-50', key: 'pct_40_50_age_group' },
  { label: '50-60', key: 'pct_50_60_age_group' },
  { label: '60-80', key: 'pct_60_80_age_group' },
  { label: '80+', key: 'pct_over_80_age_group' }
]

function filterSelectedCellForVisualization(selectedCellsList) {
  return selectedCellsList.map(selectedCells => 
    selectedCells.map(cell =>
      merchantSample.filter(m =>
        m.fid === (cell.fid % 100 + 35000) // for demo purpose on sampling
      )
    )
  )
}

function demoDataShaper (vizData, vizPreset) {
  return  vizData.map(data => 
    vizPreset.map(x => ({
      label: x.label,
      value: data.flat().reduce((count, d) => count + Math.round(d[x.key] * d.sum_cust), 0)
    }))
  )
}

/**
 * @function getGridData
 * @description Get sample grid data for heatmap
 * @return {Array} sample grid data
 */
function getGridData () {
  return allGridSample
  .map(loc => ({
    fid: loc.fid,
    position: [parseFloat(loc.cen_long), parseFloat(loc.cen_lat)],
    weight: Number(loc.sum_cust)
  }))
  .sort()
}

/**
 * @function getVisualizeData
 * @description Get sample visualize data for visualize panel
 * @param {Array} mapViews Array of each map view state 
 * @return {Object} Data to be rendered by each chart
 */
function getVisualizeData (mapViews) {
  const visualizeData = filterSelectedCellForVisualization(mapViews.map(view => view.selection.cells))

  const randSum = Math.floor(Math.random() * 10000) + 1000
  const binCount = binLabel.map(bin => ({
    label: bin,
    value: Math.floor((Math.random() * randSum) / (binLabel.length * 2)) // Random chart data
  }))

  // reshape data
  const timeOfTheDay = visualizeData.filter(viewData => viewData.length > 0).map(viewData => 
    viewData.reduce((sum, selectionIndex) => {
      const weekdayCount = viewData[0].filter(d => d.weekday === 'weekday').map(d => parseInt(d.sum_cust, 10))
      const weekendCount = viewData[0].filter(d => d.weekday === 'weekend').map(d => parseInt(d.sum_cust, 10))
      const selectionCount = [weekdayCount, weekdayCount, weekdayCount, weekdayCount, weekdayCount, weekendCount, weekendCount]
      return selectionCount.map((day, dayIndex) => day.map((count, hourIndex) => 
        (sum[dayIndex][hourIndex] || 0) + count
      ))
    }, [[], [], [], [], [], [], []])
  )

  const totalCustomer = timeOfTheDay
    .filter(viewData => viewData.length > 0)
    .map(viewData => viewData.flat().map((value, i) => ({ label: i, value })))
  const age = demoDataShaper(visualizeData, ageDataVizPreset)
  const prePostPaid = demoDataShaper(visualizeData, prePostPaidDataVizPreset)

  return {
    totalCustomer,
    age,
    prePostPaid,
    timeOfTheDay: timeOfTheDay.filter(viewData => viewData.length > 0),
    customerSegment: [binCount.sort((a,b) => b.value - a.value)]
  }
}

export default { getGridData, getVisualizeData }
