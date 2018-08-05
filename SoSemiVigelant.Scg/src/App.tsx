import * as React from 'react';
import * as cn from 'classnames';

import debounce = require('lodash/debounce');
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
    private readonly pwaUpdater: Updater;
    private controller: AbortController;

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

        this.controller = null;
    }

    private onUpdateCancelled() {
        this.setState({...this.state, updateStatus: UpdateStatus.Cancelled });
    }

    private readonly requestData = debounce(async (value: string) => {
        if (!value) {
            return;
        }
        this.setState({...this.state, isFetching: true});
        if (this.controller) {
            this.controller.abort();
        }
        this.controller = new AbortController();
        try {
            const { rows } = await searchByName(value);
            this.controller = null;
            if (rows) {
                this.setState({ ...this.state, rows, isFetching: false });
                return;
            }
        } catch (e) {
            const domException = e as DOMException;
            // abortError
            if (domException.code === 20) {
                return;
            }
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
                <div className="start-search"><i className="icon-search icon-big" />hol search!</div>
            </div>
        );
    };

    render() {
        const { rows, isFetching, updateStatus } = this.state;
        return (
            <div className="main-container">
                <SearchInput onTextChanged={(value) => this.requestData(value)}/>
                {
                    isFetching
                        ? <div className="loading-container">
                            <div className="loading"><i className="icon-spinner8 icon-big icon-rotating" />Loading</div>
                        </div>
                        : this.renderTable(rows)
                }
                <UpdateLabel status={updateStatus} onRequestUpdate={() => this.pwaUpdater.performUpdate() } onUpdateCancelled={() => this.onUpdateCancelled()}/>
            </div>
        );
    }
}
