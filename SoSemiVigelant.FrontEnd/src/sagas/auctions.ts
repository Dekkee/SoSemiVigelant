import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '../actions/auctions';
import { IAuctionsInitAction } from '../actions/auctions';
import { fetchAucsIfNeeded } from "../actions";
import { IAuctionsListRequest } from '../api/contracts';

const handleFetch = function* (action: IAuctionsInitAction) {
    try {
        const request: IAuctionsListRequest = {

        };
        const auctions = yield call(fetchAucsIfNeeded, request);

        yield put(actions.fetch.done(auctions));

    } catch (e) {
        yield put(actions.fetch.fail(e));
    }
};

export default function* () {
    yield takeLatest(actions.fetch.init.type, handleFetch);
}
