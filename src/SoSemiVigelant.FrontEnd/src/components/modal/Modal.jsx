import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Button from '../Button'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '80%', 
        overlfow: 'scroll',
        padding: '10px',
        minHeight: '100px',
        minWidth: '100px'
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
        ]),
        title: PropTypes.string.isRequired
    }

    render() {
        const { onRequestClose, isOpen, title } = this.props;
        const { style = customStyles } = this.props;
        return(
            <ReactModal isOpen={isOpen} onRequestClose={onRequestClose} style={style} contentLabel="Popup window">
                <div className="modal-header">
                    <span className="modal-header-title">{title}</span>
                    <Button className="modal-header-close-button icon" icon={'clear'} onClick={onRequestClose}/>
                </div>
                <div className="modal-body">{this.props.children}</div>                
            </ReactModal>
        );
    }
}
