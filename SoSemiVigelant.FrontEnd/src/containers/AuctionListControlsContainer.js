import { connect } from 'react-redux'

import AuctionListControls from '../components/AuctionListControls'
import { fetchAucInfo, fetchAucsIfNeeded } from '../actions'

const mapStateToProps = state => {
    const { page, count, perPage } = state.auctions;
    return { page, count, perPage };
}

const AuctionListControlsContainer = connect(mapStateToProps, null)(AuctionListControls);

export default AuctionListControlsContainer;