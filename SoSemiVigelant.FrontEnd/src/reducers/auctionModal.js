import {
  REQUEST_AUC, RECEIVE_AUC, CLOSE_AUC_MODAL
} from '../actions'

function reducer(state = {
  isFetching: false,
  modalIsOpen: false,
  auction: {id: 0, name: ''}
}, action) {
    switch (action.type) {
        case REQUEST_AUC:
            return {
                ...state,
                auction: null,
                isFetching: true,
                modalIsOpen: true
            };
        case RECEIVE_AUC:
            return {
                ...state,
                isFetching: false,
                modalIsOpen: true,
                auction: action.auction,
                lastUpdated: action.receivedAt
            };
        case CLOSE_AUC_MODAL:
            return {
                ...state,
                auction: null,
                isFetching: false,
                modalIsOpen: false,
            };
        default:
            return state
    }
}

export default reducer;
