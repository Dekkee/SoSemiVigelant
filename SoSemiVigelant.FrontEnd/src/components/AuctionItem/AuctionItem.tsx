import * as React from 'react';
import { connect } from 'react-redux';

import { Ticker } from '../Ticker';
import { actions } from '../../actions/auctions';
import { Action } from 'redux';

import './AuctionItem.scss';

export type IProps = IOwnProps & IDispatchProps;

interface IOwnProps {
    name: string;
    id: number;
    estimated: Date;
    currentBid?: number;
}

interface IDispatchProps {
    onView?: (id: number) => Action;
}

const mapDispatchToProps: IDispatchProps = {
    onView: (id: number) => actions.get.init({id})
};

@(connect<null, IDispatchProps>(null, mapDispatchToProps) as any)
export class AuctionItem extends React.Component<IProps> {
    constructor (props: IProps) {
        super(props);
    }

    handleView () {
        this.props.onView(this.props.id);
    }

    render () {
        const { name, estimated, currentBid } = this.props;
        return (
            <div className="auctionItem" onClick={ this.handleView.bind(this) }>
                <span className="auction-column auction-column-name">{ name }</span>
                <Ticker className="auction-column auction-column-timeLeft" initialTime={ estimated }/>
                <span className="auction-column auction-column-currentBet">{ currentBid }</span>
            </div>
        );
    }
}
