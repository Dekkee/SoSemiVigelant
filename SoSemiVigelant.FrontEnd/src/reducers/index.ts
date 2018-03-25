import { combineReducers } from 'redux';

import * as auctions from './auction';
import * as auctionModal from './auctionModal';

export const reducer = combineReducers<IState>({
    auctions: auctions.reducer,
    auctionModal: auctionModal.reducer
});

export interface IState {
    auctionModal: auctionModal.IState;
    auctions: auctions.IState;
}
