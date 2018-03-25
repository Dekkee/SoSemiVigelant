import * as React from 'react';
import * as ReactModal from 'react-modal';
import Button from '../Button'

ReactModal.setAppElement('#root');

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

export interface IProps {
    isOpen: boolean;
    onRequestClose: () => void;
    style?: {
        content: Record<string, string>
    }
    title: string;
}

export class Modal extends React.Component<IProps> {
    render() {
        const { onRequestClose,
            isOpen,
            title,
            style = customStyles,
            children } = this.props;
        return(
            <ReactModal isOpen={isOpen} onRequestClose={onRequestClose} style={style} contentLabel="Popup window">
                <div className="modal-header">
                    <span className="modal-header-title">{title}</span>
                    <Button className="modal-header-close-button icon" icon={'clear'} onClick={onRequestClose} disabled={false}/>
                </div>
                <div className="modal-body">{children}</div>
            </ReactModal>
        );
    }
}
