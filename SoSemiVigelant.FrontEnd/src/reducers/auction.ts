import { Auction } from '../api/contracts';
import { switchCase, switchReducer } from '../utils/reducers/switchReducer';
import { actions, AuctionsDoneAction, AuctionsFailAction, AuctionsInitAction } from '../actions/auctions';

export interface IState {
    isFetching: boolean;
    page: number;
    perPage: number;
    sortOrder: string;
    sortDirection: boolean;
    items: Auction[];
    count: number;
    isActive?: boolean;
    lastUpdated?: number;
}

const initialState: IState = {
    isFetching: false,
    items: [],
    count: 0,
    page: 0,
    perPage: 20,
    sortOrder: 'estimated',
    sortDirection: true,
    isActive: true,
};

export const reducer = switchReducer<IState>(Object.assign(
    switchCase(actions.fetch.init)((state: IState, action: AuctionsInitAction): IState => ({
        ...state,
        isFetching: true,
        page: action.request.page,
        perPage: action.request.perPage,
        sortOrder: action.request.sortOrder,
        sortDirection: action.request.sortDirection,
        isActive: action.request.isActive,
    })),
    switchCase(actions.fetch.done)((state: IState, action: AuctionsDoneAction): IState => ({
        ...state,
        isFetching: false,
        items: action.response.values,
        count: action.response.count,
        lastUpdated: action.response.receivedAt
    })),
    switchCase(actions.fetch.fail)((state: IState, action: AuctionsFailAction): IState => ({
        ...state
    }))
), initialState);
