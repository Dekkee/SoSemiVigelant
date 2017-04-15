import { connect } from 'react-redux'

import AuctionItem from '../components/AuctionItem'
import { fetchAucInfo } from '../actions'

function mapDispatchToProps(dispatch) {
    return {
        onView: id => dispatch(fetchAucInfo(id))
    }
}

const AuctionItemContainer = connect(null, mapDispatchToProps)(AuctionItem);

export default AuctionItemContainer;