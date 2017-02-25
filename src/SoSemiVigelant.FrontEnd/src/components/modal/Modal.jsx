import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export class Modal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        onRequestClose: PropTypes.func,
        style: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ])
    }

    render() {
        let { onRequestClose, isOpen } = this.props;
        let { style = customStyles } = this.props;
        return(
            <ReactModal isOpen={isOpen} onRequestClose={onRequestClose} style={style} contentLabel="Popup window">
                <button className="close-button modal-container__close-button" type="button" onClick={onRequestClose}>
                    <span>&times;</span>
                </button>
                {this.props.children}
            </ReactModal>
        );
    }
}