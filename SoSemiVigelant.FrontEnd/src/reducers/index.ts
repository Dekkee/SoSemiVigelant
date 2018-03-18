import { combineReducers } from 'redux';

import { reducer as auctions } from './auction';
import { reducer as auctionModal } from './auctionModal';

export const reducer = combineReducers({
    auctions,
    auctionModal
});
