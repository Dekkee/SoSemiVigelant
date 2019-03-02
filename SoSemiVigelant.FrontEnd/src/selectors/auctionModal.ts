import { IState as IAuctionState } from '../reducers/auctionModal';
import { IState } from '../reducers';

export const selector = (state: IState): IAuctionState => state.auctionModal;
