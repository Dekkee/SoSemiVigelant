import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, AuctionsInitAction } from '../actions/auctions';
import { fetchAucs } from '../actions';
import { AuctionsListResponse } from '../api/contracts';

const handleFetch = function* (action: AuctionsInitAction) {
    try {
        const response: AuctionsListResponse = yield call(fetchAucs, action.request);

        yield put(actions.fetch.done(response));

    } catch (e) {
        yield put(actions.fetch.fail(e));
    }
};

export function* saga () {
    yield takeLatest(actions.fetch.init.type, handleFetch);
}
