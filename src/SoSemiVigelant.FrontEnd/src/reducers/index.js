import { combineReducers } from 'redux';

import { default as auctions } from './auction';

const reducer = combineReducers({
    auctions
});

export default reducer;