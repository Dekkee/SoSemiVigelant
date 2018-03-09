import React from 'react'
import PropTypes from 'prop-types';

import { Modal } from './modal'

class AuctionItemModal extends React.Component{
  static propTypes = {
        auction: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        }),
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number
    };

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
      const { onClose } = this.props;
      onClose();
  }

  render() {
    const { auction, isFetching, modalIsOpen } = this.props;
        return (
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={this.closeModal}
                    title={auction && auction.name}>
                    {modalIsOpen && isFetching
                        ? <h2 className="loading">Loading...</h2> 
                        : auction && <div>
                            <div>Стартовая ставка: {auction.startBid}</div>
                            <div>Текущая ставка: {auction.currentBid}</div>
                            <div>Всего ставка: {auction.bidAmount}</div>
                            <div>Город: {auction.city}</div>
                            <div>Доставка: {auction.shippingInfoShort}</div>
                            <div>Доставка (полное): {auction.shippingInfo}</div>
                            {
                                auction.seller && <div>
                                    <div>{`Продавец: ${auction.seller.name}(${auction.seller.refs})`}</div>
                                    <div dangerouslySetInnerHTML={{__html: auction.description}}/>
                                </div>
                            }
                        </div>
                    }
                </Modal>
            </div>
        );
    }
} 

export default AuctionItemModal
