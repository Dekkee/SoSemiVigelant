import { combineReducers } from 'redux'

import {
  REQUEST_AUCS, RECEIVE_AUCS, INVALIDATE_AUCS,
  REQUEST_AUC, RECEIVE_AUC
} from '../actions'

const aucs = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_AUCS:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_AUCS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_AUCS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const getAucs = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_AUCS:
        case RECEIVE_AUCS:
        case INVALIDATE_AUCS:
        case REQUEST_AUC:
        case RECEIVE_AUC:
            return {
                ...state,
                data: aucs(state['data'], action)
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    getAucs
})

export default rootReducer
