import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, IAuctionsInitAction } from '../actions/auctions';
import { fetchAucs } from '../actions';
import { IAuctionsListResponse } from '../api/contracts';

const handleFetch = function* (action: IAuctionsInitAction) {
    try {
        const response: IAuctionsListResponse = yield call(fetchAucs, action.request);

        yield put(actions.fetch.done(response));

    } catch (e) {
        yield put(actions.fetch.fail(e));
    }
};

export function* saga () {
    yield takeLatest(actions.fetch.init.type, handleFetch);
}
