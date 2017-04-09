import React, { PropTypes } from 'react'
import renderHTML from 'react-render-html';

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
      const { onClose } = this.props;
      onClose();
  }

  render() {
    const { auction, isFetching, lastUpdated, modalIsOpen } = this.props;
        return (
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={this.closeModal}>
                    {modalIsOpen && isFetching 
                        ? <h2>Loading...</h2> 
                        : <div>
                            <span>{auction.name}</span>
                            <div dangerouslySetInnerHTML={{__html: auction.description}}/>
                        </div>
                    }
                </Modal>
            </div>
        );
    }
} 

export default AuctionItemModal
