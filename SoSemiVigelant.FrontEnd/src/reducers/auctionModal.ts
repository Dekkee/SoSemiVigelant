import {
  REQUEST_AUC, RECEIVE_AUC, CLOSE_AUC_MODAL
} from '../actions/index'

export interface IState {
    isFetching: boolean;
    modalIsOpen: boolean;
    auction: IAuction;
}

export const reducer = (state: IState = {
  isFetching: false,
  modalIsOpen: false,
  auction: {
      id: 0,
      name: '',
      startBid: 0,
      bidAmount: 0,
      city: '',
      description: '',
      seller: {
          name: '',
          refs: 0,
      },
      currentBid: 0,
      shippingInfo: '',
      shippingInfoShort: '',
  }
}, action) => {
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
};
