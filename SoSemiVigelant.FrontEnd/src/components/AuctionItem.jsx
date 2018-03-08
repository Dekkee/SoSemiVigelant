import React from 'react';
import PropTypes from 'prop-types';

import Ticker from './Ticker'

class AuctionItem extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        timeLeft: PropTypes.number,
        currentBid: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.handleView = this.handleView.bind(this);
    }

    handleView() {
        this.props.onView(this.props.id);
    }

    render() {
        return (
            <div className="auctionItem" onClick={this.handleView}>
                <span className="auction-column auction-column-name">{this.props.name}</span>
                <Ticker className="auction-column auction-column-timeLeft" initialTime={this.props.timeLeft}/>
                <span className="auction-column auction-column-currentBet">{this.props.currentBid}</span>
            </div>
        );
    }
}

export default AuctionItem;
