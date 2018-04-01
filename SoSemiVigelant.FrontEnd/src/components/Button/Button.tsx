import * as React from 'react';

import './Button.scss';

export interface IProps {
    className: string;
    icon?: string;
    disabled: boolean;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export class Button extends React.Component<IProps> {
    constructor (props: IProps) {
        super(props)
    }

    render () {
        const { className, onClick, icon, children } = this.props;
        return (
            <button className={ className } onClick={ onClick }>
                { icon
                    ? <i className="material-icons">{ icon }</i>
                    : children
                }
            </button>
        );
    }
}

