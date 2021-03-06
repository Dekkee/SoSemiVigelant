import { IAuction } from '../api/contracts';
import { switchCase, switchReducer } from '../utils/reducers/switchReducer';
import { actions, IAuctionDoneAction, IAuctionFailAction, IAuctionInitAction } from '../actions/auctions';
import { Action } from 'redux';

export interface IState {
    isFetching: boolean;
    modalIsOpen: boolean;
    auction?: IAuction;
    lastUpdated?: number;
}

const initial: IState = {
    isFetching: false,
    modalIsOpen: false
};

export const reducer = switchReducer<IState>(Object.assign(
    switchCase(actions.get.init)((state: IState, action: IAuctionInitAction): IState => ({
        ...state,
        auction: null,
        isFetching: true,
        modalIsOpen: true
    })),
    switchCase(actions.get.done)((state: IState, action: IAuctionDoneAction): IState => ({
        ...state,
        isFetching: false,
        modalIsOpen: true,
        auction: action.response.auction,
        lastUpdated: action.response.receivedAt
    })),
    switchCase(actions.get.fail)((state: IState, action: IAuctionFailAction): IState => ({
        ...state
    })),
    switchCase(actions.closeModal)((state: IState, action: Action): IState => ({
        ...state,
        auction: null,
        isFetching: false,
        modalIsOpen: false,
    }))
), initial);
