import {IState as IAuctionState} from '../reducers/auction';
import {IState} from '../reducers';

export const selector = (state: IState): IAuctionState => state.auctions;
