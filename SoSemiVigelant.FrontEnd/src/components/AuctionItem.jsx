import React from 'react';
import PropTypes from 'prop-types';

import Ticker from './Ticker'

class AuctionItem extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        estimated: PropTypes.number,
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
        const {name, estimated, currentBid} = this.props;
        return (
            <div className="auctionItem" onClick={this.handleView}>
                <span className="auction-column auction-column-name">{name}</span>
                <Ticker className="auction-column auction-column-timeLeft" initialTime={estimated}/>
                <span className="auction-column auction-column-currentBet">{currentBid}</span>
            </div>
        );
    }
}

export default AuctionItem;
