import { IAuction } from '../api/contracts';
import { switchCase, switchReducer } from '../utils/reducers/switchReducer';
import { actions, IAuctionsDoneAction, IAuctionsFailAction, IAuctionsInitAction } from '../actions/auctions';

export interface IState {
    isFetching: boolean;
    page: number;
    perPage: number;
    sortOrder: string;
    sortDirection: boolean;
    items: IAuction[];
    count: number;
    lastUpdated?: number;
}

const initialState: IState = {
    isFetching: false,
    items: [],
    count: 0,
    page: 0,
    perPage: 20,
    sortOrder: 'estimated',
    sortDirection: true
};

export const reducer = switchReducer<IState>(Object.assign(
    switchCase(actions.fetch.init)((state: IState, action: IAuctionsInitAction): IState => ({
        ...state,
        isFetching: true,
        page: action.request.page,
        perPage: action.request.perPage,
        sortOrder: action.request.sortOrder,
        sortDirection: action.request.sortDirection
    })),
    switchCase(actions.fetch.done)((state: IState, action: IAuctionsDoneAction): IState => ({
        ...state,
        isFetching: false,
        items: action.response.values,
        count: action.response.count,
        lastUpdated: action.response.receivedAt
    })),
    switchCase(actions.fetch.fail)((state: IState, action: IAuctionsFailAction): IState => ({
        ...state
    }))
), initialState);
