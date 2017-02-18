import {
  REQUEST_AUCS, RECEIVE_AUCS, INVALIDATE_AUCS,
  REQUEST_AUC, RECEIVE_AUC
} from '../actions'

const aucsReducer = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
    console.log('aucsReducer', state);
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

function reducer(state = {}, action) {
    switch (action.type) {
        case REQUEST_AUCS:
        case RECEIVE_AUCS:
        case INVALIDATE_AUCS:
        case REQUEST_AUC:
        case RECEIVE_AUC:
            return {
                ...aucsReducer(state, action)
            }
        default:
            return state;
    }
}

export default reducer;