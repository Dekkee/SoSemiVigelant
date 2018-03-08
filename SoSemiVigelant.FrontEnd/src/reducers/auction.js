import {
    REQUEST_AUCS,
    RECEIVE_AUCS,
    INVALIDATE_AUCS
} from '../actions'

function reducer(state = {}, action) {
    switch (action.type) {
        case REQUEST_AUCS:
            return {
                ...state,
                isFetching: true,
                page: action.page,
                perPage: action.perPage,
                sortOrder: action.sortOrder,
                sortDirection: action.sortDirection
            }
        case RECEIVE_AUCS:
            return {
                ...state,
                isFetching: false,
                items: action.result,
                count: action.count,
                lastUpdated: action.receivedAt
            }
        default:
            return state
    }
}

export default reducer;