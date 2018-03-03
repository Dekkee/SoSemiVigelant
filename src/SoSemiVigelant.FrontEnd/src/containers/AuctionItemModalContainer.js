import { connect } from 'react-redux'

import AuctionItemModal from '../components/AuctionItemModal'
import { fetchAucInfo, closeAucModal } from '../actions'

const mapStateToProps = state => {
    const {
        isFetching,
        lastUpdated,
        modalIsOpen,
        auction
    } = state.auctionModal || {
        isFetching: false,
        modalIsOpen: false,
        auction: { id: 0, name: '' }
    }

    return {
        auction,
        isFetching,
        lastUpdated,
        modalIsOpen
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onClose: () => dispatch(closeAucModal())
    }
}

const AuctionItemModalContainer = connect(mapStateToProps, mapDispatchToProps)(AuctionItemModal);

export default AuctionItemModalContainer;