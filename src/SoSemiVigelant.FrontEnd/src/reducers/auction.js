import {
  REQUEST_AUCS, RECEIVE_AUCS, INVALIDATE_AUCS
} from '../actions'

function reducer(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
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
                items: action.values,
                lastUpdated: action.receivedAt
            }
        default:
            return state
    }
}

export default reducer;