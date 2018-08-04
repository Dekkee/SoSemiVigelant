import * as React from 'react';
import * as cn from 'classnames';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'whatwg-fetch';

import { ChangeEvent } from "react";
import { debounce } from 'lodash';
import { ParsedRow } from "./entities/Row";
import { CardLayout } from "./components/CardLayout";

import './App.scss';
import { ScgResponce } from './server/html-parser';

interface IState {
    rows?: ParsedRow[];
    isFetching: boolean;
}

const url = process.env.NODE_ENV === 'production'
    ? ''
    : '//localhost:8081';

export class App extends React.Component<{}, IState> {
    constructor(props) {
        super(props);

        this.state = {
            rows: null,
            isFetching: false,
        }
    }

    private controller: AbortController = null;

    requestData = debounce(async (value: string) => {
        if (!value) {
            return;
        }
        this.setState({...this.state, isFetching: true});
        if (this.controller) {
            this.controller.abort();
        }
        this.controller = new AbortController();
        try {
            const { rows } = await (await fetch(`${url}/api?name=${value}`, { signal: this.controller.signal })).json() as ScgResponce;
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

    onInput = (e: ChangeEvent) => this.requestData((e.target as HTMLInputElement).value);

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
        const { rows, isFetching } = this.state;
        return (
            <div className="main-container">
                <div className="search-container">
                    <input onChange={(e) => this.onInput(e)} className="search-input" id="search-input" required />
                    <label htmlFor="search-input" className="search-label">Search</label>
                </div>
                {
                    isFetching
                        ? <div className="loading-container">
                            <div className="loading"><i className="icon-spinner8 icon-big" />Loading</div>
                        </div>
                        : this.renderTable(rows)
                }
            </div>
        );
    }
}
