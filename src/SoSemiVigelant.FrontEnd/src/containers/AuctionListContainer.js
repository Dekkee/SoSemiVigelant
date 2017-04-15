import { connect } from 'react-redux'

import AuctionList from '../components/AuctionList'
import { fetchAucInfo, fetchAucsIfNeeded } from '../actions'

const mapStateToProps = state => {
    const {
        isFetching,
        lastUpdated,
        items,
        count,
        page,
        sortOrder,
        sortDirection
    } = state.auctions || {
        isFetching: true,
        items: [],
        page: 0,
        sortOrder: 'timeLeft',
        sortDirection: true
    }

    return {
        items,
        isFetching,
        lastUpdated,
        count,
        page,
        sortOrder,
        sortDirection
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadAucs: request => dispatch(fetchAucsIfNeeded(request))
    }
}

const AuctionListContainer = connect(mapStateToProps, mapDispatchToProps)(AuctionList);

export default AuctionListContainer;