import * as React from 'react';
import { connect } from '../../utils/connect';

import { Ticker } from '../Ticker';
import { actions } from '../../actions/auctions';
import { Action } from 'redux';

import './AuctionItem.scss';

export type Props = OwnProps & DispatchProps;

interface OwnProps {
    name: string;
    id: number;
    estimated: Date;
    currentBid?: number;
}

interface DispatchProps {
    onView?: (id: number) => Action;
}

const mapDispatchToProps: DispatchProps = {
    onView: (id: number) => actions.get.init({ id })
};

@connect<any, DispatchProps>(null, mapDispatchToProps)
export class AuctionItem extends React.Component<Props> {
    constructor (props: Props) {
        super(props);
    }

    handleView () {
        this.props.onView(this.props.id);
    }

    render () {
        const { name, estimated, currentBid } = this.props;
        return (
            <div className="auction-item" onClick={this.handleView.bind(this)}>
                <span className="auction-column auction-column__name">{name}</span>
                <Ticker className="auction-column auction-column__timeLeft" initialTime={estimated}/>
                <span className="auction-column auction-column__currentBet">{currentBid}</span>
            </div>
        );
    }
}
