import { Action } from 'redux';
import { action, initActionCreators } from '../utils/actions/actionCreatorFactory';
import { IErrorResponse } from '../api/core';
import {
    IAuction, IAuctionInfoRequest, IAuctionInfoResponse, IAuctionsListRequest,
    IAuctionsListResponse
} from '../api/contracts';

export interface IAuctionsInitAction extends Action {
    request: IAuctionsListRequest;
}

export interface IAuctionsDoneAction extends Action {
    response: IAuctionsListResponse;
}

export interface IAuctionsFailAction extends Action {
    error: IErrorResponse;
}

export interface IAuctionInitAction extends Action {
    request: IAuctionInfoRequest;
}

export interface IAuctionDoneAction extends Action {
    response: IAuctionInfoResponse;
}

export interface IAuctionFailAction extends Action {
    error: IErrorResponse;
}

export const actions = {
    fetch: {
        init: action((request: IAuctionsListRequest) => ({ request })),
        done: action((response: IAuctionsListResponse) => ({ response })),
        fail: action((error: IErrorResponse) => ({ error })),
    },
    get: {
        init: action((request: IAuctionInfoRequest) => ({ request })),
        done: action((response: IAuctionInfoResponse) => ({ response })),
        fail: action((error: IErrorResponse) => ({ error })),
    },
    closeModal: action(() => ({})),
};

initActionCreators(`auctions/`, actions);
console.log(actions);
console.log(actions.closeModal());
