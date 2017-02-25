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
        let { style = customStyles } = this.props;
        return(
            <ReactModal {...modalProps} style={style}>
                <button className="close-button modal-container__close-button" type="button" onClick={modalProps.onRequestClose}>
                    <span>&times;</span>
                </button>
                {this.props.children}
            </ReactModal>
        );
    }
}