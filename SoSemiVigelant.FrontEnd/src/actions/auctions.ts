import { Action } from 'redux';
import { action, initActionCreators } from '../utils/actions/actionCreatorFactory';
import { ErrorResponse } from '../api/core';
import {
    AuctionInfoRequest,
    AuctionInfoResponse,
    AuctionsListRequest,
    AuctionsListResponse
} from '../api/contracts';

export interface AuctionsInitAction extends Action {
    request: AuctionsListRequest;
}

export interface AuctionsDoneAction extends Action {
    response: AuctionsListResponse;
}

export interface AuctionsFailAction extends Action {
    error: ErrorResponse;
}

export interface AuctionInitAction extends Action {
    request: AuctionInfoRequest;
}

export interface AuctionDoneAction extends Action {
    response: AuctionInfoResponse;
}

export interface AuctionFailAction extends Action {
    error: ErrorResponse;
}

export const actions = {
    fetch: {
        init: action((request: AuctionsListRequest) => ({ request })),
        done: action((response: AuctionsListResponse) => ({ response })),
        fail: action((error: ErrorResponse) => ({ error })),
    },
    get: {
        init: action((request: AuctionInfoRequest) => ({ request })),
        done: action((response: AuctionInfoResponse) => ({ response })),
        fail: action((error: ErrorResponse) => ({ error })),
    },
    closeModal: action(() => ({})),
};

initActionCreators(`auctions/`, actions);
