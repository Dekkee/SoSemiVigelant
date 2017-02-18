import React from 'react';

import Button from './Button'

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