import { connect } from 'react-redux'

import AuctionItem from '../components/AuctionItem'
import { fetchAucInfo } from '../actions'

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
        onView: id => dispatch(fetchAucInfo(id))
    }
}

const AuctionItemContainer = connect(null, mapDispatchToProps)(AuctionItem);

export default AuctionItemContainer;