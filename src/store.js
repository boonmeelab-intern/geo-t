import { createStore, combineReducers } from 'redux'

import initialState from './initialState.json'
import compareViewReducer from './reducers/compareView'
import mainMapReducer from './reducers/mainMap'
import secondaryMapReducer from './reducers/secondaryMap'

const reducers = combineReducers({
  compareView: compareViewReducer,
  mainMap: mainMapReducer,
  secondaryMap: secondaryMapReducer
})

export default createStore(reducers, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())