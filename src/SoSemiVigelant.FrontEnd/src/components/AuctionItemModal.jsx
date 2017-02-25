import React, { PropTypes } from 'react'

import { fetchAucsIfNeeded } from '../actions'
import AuctionItemContainer from '../containers/AuctionItemContainer'
import { Modal } from './modal'

class AuctionItemModal extends React.Component{
  static propTypes = {
        auction: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        }),
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number
    }

  constructor(props) {
    super(props)

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
      console.log(this.props);
      const { onClose } = this.props;
      onClose();
  }

  render() {
    const { auction, isFetching, lastUpdated } = this.props;
        return (
            <div>
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.closeModal}>
                {isFetching ? <h2>Loading...</h2> : <span>{auction.name}</span>}
            </Modal>
            </div>
        );
    }
} 

export default AuctionItemModal
