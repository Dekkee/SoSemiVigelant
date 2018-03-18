import * as React from 'react'
import { connect } from 'react-redux';

import { closeAucModal } from '../actions'
import { Modal } from './modal'

type IProps = IOwnProps & IStateProps & IDispatchProps;

export interface IOwnProps {

}

interface IStateProps {
    isFetching?: boolean;
    modalIsOpen?: boolean;
    auction?: IAuction;
    lastUpdated?: number;
}

interface IDispatchProps {
    onClose?: () => void;
}

const mapStateToProps = state => state.auctionModal;

const mapDispatchToProps = (dispatch) => ({
    onClose: () => dispatch(closeAucModal())
});

@(connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps) as any)
export class AuctionItemModal extends React.Component<IProps> {

  constructor(props) {
    super(props);
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
                    onRequestClose={this.closeModal.bind(this)}
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
