import { all, fork } from 'redux-saga/effects';

import { saga as auctionsSaga } from './auctions';
import { saga as auctionModalSaga } from './auctionModal';

export function* root () {
    yield all([
        fork(auctionsSaga),
        fork(auctionModalSaga),
    ]);
}
