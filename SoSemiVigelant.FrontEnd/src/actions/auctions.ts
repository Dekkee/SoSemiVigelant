import { Action } from 'redux';
import { action, initActionCreators } from '../utils/actions/actionCreatorFactory';
import { IErrorResponse } from '../api/core';
import { IAuction } from '../api/contracts';

export interface IAuctionsInitAction extends Action {
}

export interface IAuctionsDoneAction extends Action {
    auctions: IAuction[];
}

export interface IAuctionsFailAction extends Action {
    error: IErrorResponse;
}

export const actions = {
    fetch: {
        init: action(() => ({})),
        done: action((auctions: IAuction[]) => ({ auctions })),
        fail: action((error: IErrorResponse) => ({ error })),
    }
};

initActionCreators(`auctions/`, actions);
