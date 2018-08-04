import * as React from 'react';
import * as cn from 'classnames';

import { debounce } from 'lodash';
import { ParsedRow } from "./entities/Row";
import { CardLayout } from "./components/CardLayout";
import { SearchInput } from "./components/SearchInput";
import { searchByName } from './api';

import './App.scss';
import { Updater } from "./pwa/updater";
import { UpdateStatus, UpdateLabel } from "./components/UpdateLabel";


interface State {
    rows?: ParsedRow[];
    isFetching: boolean;
    updateStatus: UpdateStatus;
}

export class App extends React.Component<{}, State> {
    private pwaUpdater: Updater;

    constructor(props) {
        super(props);

        this.state = {
            rows: null,
            isFetching: false,
            updateStatus: UpdateStatus.NotRequired,
        };

        this.pwaUpdater = new Updater({
            onUpdateReady: () => this.setState({...this.state, updateStatus: UpdateStatus.Required }),
            onUpdated: () => window.location.reload(),
            onUpdateFailed: () => this.setState({...this.state, updateStatus: UpdateStatus.Failed }),
            onUpdating: () => this.setState({...this.state, updateStatus: UpdateStatus.Updating }),
        });
    }

    requestData = debounce(async (value: string) => {
        if (!value) {
            return;
        }
        this.setState({...this.state, isFetching: true});
        try {
            const { rows } = await searchByName(value);
            if (rows) {
                this.setState({ ...this.state, rows, isFetching: false });
                return;
            }
        } catch (e) {
            this.setState({ ...this.state, isFetching: false });
        }
    }, 300);

    renderTable(rows: ParsedRow[]) {
        return (rows
            ? rows.length
                ? rows.map((row, i) => <CardLayout className={cn({ "card-layout--dark": i % 2 })}
                    card={row}
                    key={i} />)
                : <div className="empty-container">
                    <div className="empty"><i className="icon-sad icon-big" />Not found</div>
                </div>
            : <div className="start-search-container">
                <div className="start-search"><i className="icon-search icon-big" />Start search!</div>
            </div>
        );
    };

    render() {
        const { rows, isFetching, updateStatus } = this.state;
        return (
            <div className="main-container">
                <SearchInput onTextChanged={this.requestData.bind(this)}/>
                {
                    isFetching
                        ? <div className="loading-container">
                            <div className="loading"><i className="icon-spinner8 icon-big icon-rotating" />Loading</div>
                        </div>
                        : this.renderTable(rows)
                }
                <UpdateLabel status={updateStatus} onRequestUpdate={() => this.pwaUpdater.performUpdate() }/>
            </div>
        );
    }
}
