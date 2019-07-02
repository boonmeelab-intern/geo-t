import types from '../constants'

export const compareView = (state = [], action) =>
  (action.type === types.SET_COMPAREVIEW) ? action.payload : state

export default compareView