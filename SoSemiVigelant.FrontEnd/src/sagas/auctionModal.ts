import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, IAuctionInitAction } from '../actions/auctions';
import { fetchAucInfo, } from '../actions';
import { IAuctionInfoResponse } from '../api/contracts';

const handleFetch = function* (action: IAuctionInitAction) {
    try {
        const response: IAuctionInfoResponse = yield call(fetchAucInfo, action.request);

        yield put(actions.get.done(response));

    } catch (e) {
        yield put(actions.get.fail(e));
    }
};

export function* saga () {
    yield takeLatest(actions.get.init.type, handleFetch);
}
