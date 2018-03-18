import * as React from 'react';
import { connect } from 'react-redux';

import { Ticker } from './Ticker';
import { fetchAucInfo } from '../actions';

export interface IProps {
    name: string;
    id: number;
    estimated: number;
    currentBid?: number;
    onView: (id: number) => void;
}

interface IDispatchProps {
    onView?: (id: number) => (dispatch: any, getState: any) => Promise<any>;
}

const mapDispatchToProps: IDispatchProps = {
    onView: (id: number) => fetchAucInfo(id)
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
