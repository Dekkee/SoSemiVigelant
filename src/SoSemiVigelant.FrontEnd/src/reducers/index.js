import { combineReducers } from 'redux';

import { default as auctions } from './auction';
import { default as auctionModal } from './auctionModal';

const reducer = combineReducers({
    auctions,
    auctionModal
});

export default reducer;