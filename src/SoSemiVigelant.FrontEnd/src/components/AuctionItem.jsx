import React, { PropTypes } from 'react';

import Button from './Button'
import Ticker from './Ticker'
import { fetchAucInfo } from '../actions'

class AuctionItem extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        timeLeft: PropTypes.number,
        currentBet: PropTypes.number
    }

    constructor(props) {
        super(props);

        this.handleView = this.handleView.bind(this);
    }

    handleView() {
        this.props.onView(this.props.id);
    }

    render() {
        return (
            <div className="auctionItem">
                <Button className="icon" icon="visibility" onClick={this.handleView} />
                <span className="auctionItem-title">{this.props.name}</span>
                <Ticker initialTime={this.props.timeLeft}/>
                <span className="auctionItem-currentBet">{this.props.currentBet}</span>
            </div>
        );
    }
}

export default AuctionItem;