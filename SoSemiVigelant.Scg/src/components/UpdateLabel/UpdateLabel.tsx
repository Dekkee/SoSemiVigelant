import * as React from 'react';
import * as cn from 'classnames';

import './UpdateLabel.scss';

export enum UpdateStatus {
    Required,
    NotRequired,
    Updating,
    Failed
}

export interface Props {
    status: UpdateStatus;
    onRequestUpdate: () => void;
}

export class UpdateLabel extends React.PureComponent<Props> {
    constructor (props) {
        super(props);
    }

    render () {
        const { status, onRequestUpdate } = this.props;
        const isHidden = status === UpdateStatus.NotRequired;
        const isFailed = status === UpdateStatus.Failed;
        return (
            <div className={cn(
                "update-label-container",
                {"update-label-container--hidden": isHidden},
                {"update-label-container--failed": isFailed},
                )}>
                {
                    status === UpdateStatus.Required &&
                    <span className="update-label update-label--ready" onClick={onRequestUpdate}>Update is ready.<br/>Tap me to start updating!</span>
                }
                {
                    status === UpdateStatus.Updating &&
                    <div className="update-label update-label--updating"><i className="icon-spinner8 icon-big icon-rotating" />Updating</div>
                }
                {
                    status === UpdateStatus.Failed &&
                    <div className="update-label update-label--failed"><i className="icon-sad icon-big" />Update is failed!</div>
                }
                {
                    !isHidden &&
                    <div className="update-label update-label__close">&times;</div>
                }
            </div>
        )
    }
}
