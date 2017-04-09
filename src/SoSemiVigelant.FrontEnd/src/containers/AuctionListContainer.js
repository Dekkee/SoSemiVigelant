import { connect } from 'react-redux'

import AuctionList from '../components/AuctionList'
import { fetchAucInfo, fetchAucsIfNeeded } from '../actions'

const mapStateToProps = state => {
    const {
        isFetching,
        lastUpdated,
        items,
        count
    } = state.auctions || {
        isFetching: true,
        items: []
    }

    return {
        items,
        isFetching,
        lastUpdated,
        count
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadAucs: request => dispatch(fetchAucsIfNeeded(request))
    }
}

const AuctionListContainer = connect(mapStateToProps, mapDispatchToProps)(AuctionList);

export default AuctionListContainer;