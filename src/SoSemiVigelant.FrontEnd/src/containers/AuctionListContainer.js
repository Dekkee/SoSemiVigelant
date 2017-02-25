import { connect } from 'react-redux'

import AuctionList from '../components/AuctionList'
import { fetchAucInfo, fetchAucsIfNeeded } from '../actions'

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

function mapDispatchToProps(dispatch) {
    return {
        loadAucs: props => dispatch(fetchAucsIfNeeded(props))
    }
}

const AuctionListContainer = connect(mapStateToProps, mapDispatchToProps)(AuctionList);

export default AuctionListContainer;