import React from 'react'
import PropTypes from 'prop-types';
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
                    onRequestClose={this.closeModal}
                    title={auction.name}>
                    {modalIsOpen && isFetching 
                        ? <h2 className="loading">Loading...</h2> 
                        : <div>
                            <div dangerouslySetInnerHTML={{__html: auction.description}}/>
                        </div>
                    }
                </Modal>
            </div>
        );
    }
} 

export default AuctionItemModal
