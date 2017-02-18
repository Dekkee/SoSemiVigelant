import React from 'react';

class AuctionItem extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        id: React.PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>{this.props.name}</div>
        );
    }
}

export default AuctionItem;