import { connect } from 'react-redux'

import AuctionList from '../components/AuctionList'

const mapStateToProps = state => {
    const {
        isFetching,
        lastUpdated,
        items
    } = state.auctions || {
        isFetching: true,
        items: []
    }

    return {
        items,
        isFetching,
        lastUpdated
    }
}

const AuctionListContainer = connect(mapStateToProps)(AuctionList);

export default AuctionListContainer;