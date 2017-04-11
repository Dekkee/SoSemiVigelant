import {
    REQUEST_AUCS,
    RECEIVE_AUCS,
    INVALIDATE_AUCS
} from '../actions'

function reducer(state = {
    isFetching: false,
    items: [],
    page: 0
}, action) {
    switch (action.type) {
        case REQUEST_AUCS:
            return {
                ...state,
                isFetching: true,
                page: action.page
            }
        case RECEIVE_AUCS:
            return {
                ...state,
                isFetching: false,
                items: action.values,
                count: action.count,
                lastUpdated: action.receivedAt
            }
        default:
            return state
    }
}

export default reducer;