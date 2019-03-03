import * as React from 'react';
import { connect } from '../utils/connect';

import { Modal } from './Modal';
import { Auction } from '../api/contracts';
import { actions } from '../actions/auctions';
import { selector } from '../selectors/auctionModal';

type Props = OwnProps & StateProps & DispatchProps;

export interface OwnProps {

}

interface StateProps {
    isFetching?: boolean;
    modalIsOpen?: boolean;
    auction?: Auction;
    lastUpdated?: number;
}

interface DispatchProps {
    onClose?: () => void;
}

const mapStateToProps = state => selector(state);

const mapDispatchToProps: DispatchProps = ({
    onClose: () => actions.closeModal()
});

@connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)
export class AuctionItemModal extends React.Component<Props> {

    constructor (props) {
        super(props);
    }

    closeModal () {
        const { onClose } = this.props;
        onClose();
    }

    render () {
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
                                <div dangerouslySetInnerHTML={{ __html: auction.description }}/>
                            </div>
                        }
                    </div>
                    }
                </Modal>
            </div>
        );
    }
} 
