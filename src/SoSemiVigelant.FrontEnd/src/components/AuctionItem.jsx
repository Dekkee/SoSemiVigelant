import React from 'react';

import Button from './Button'
import { fetchAucInfo } from '../actions'

class AuctionItem extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        id: React.PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);

        this.handleView = this.handleView.bind(this);
    }

    handleView() {

console.log(this.props);
        this.props.onView(this.props.id);
    }

    render() {
        return (
            <div className="auctionItem">
                <span className="auctionItem-title">{unescape(this.props.name)}</span>
                <Button className="icon" icon="visibility" onClick={this.handleView} />
            </div>
        );
    }
}

export default AuctionItem;