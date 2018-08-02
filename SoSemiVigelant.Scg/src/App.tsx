import * as React from 'react';
import * as cn from 'classnames';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'whatwg-fetch';

import { ChangeEvent } from "react";
import { debounce } from 'lodash';
import { ParsedRow } from "./entities/Row";
import { CardLayout } from "./components/CardLayout";

import './App.scss';

interface IState {
    rows?: ParsedRow[]
}

const url = process.env.NODE_ENV === 'production'
    ? ''
    : '//localhost:8081';

export class App extends React.Component<{}, IState> {
    constructor(props) {
        super(props);

        this.state = {
            rows: null
        }
    }

    private controller: AbortController = null;

    requestData = debounce(async (value: string) => {
        if (!value) {
            return;
        }
        if (this.controller) {
            this.controller.abort();
        }
        this.controller = new AbortController();
        try {
            const rows = await (await fetch(`${url}/api?name=${value}`, { signal: this.controller.signal })).json() as ParsedRow[];
            this.controller = null;
            if (rows) {
                this.setState({ rows });
            }
        } catch (e) { }
    }, 300);

    onInput = (e: ChangeEvent) => this.requestData((e.target as HTMLInputElement).value);

    render() {
        const { rows } = this.state;
        return (
            <div className="main-container">
                <div className="search-container">
                    <input onChange={(e) => this.onInput(e)} className="search-input" />
                </div>
                {
                    rows
                        ? rows.length
                            ?
                            // ? <div className="cards-container">
                            //     <span>Name</span>
                            //     <span>Category</span>
                            //     <span>Rarity</span>
                            //     <span>Condition</span>
                            //     <span>Price</span>
                            //    {
                            rows.map((row, i) => <CardLayout className={cn({ "card-layout--dark": i % 2 })}
                                card={row}
                                key={i} />)
                            //    }
                            // </div>
                            : <div className="empty-container">
                                <div className="empty">empty</div>
                            </div>
                        : <div className="start-search-container">
                            <div className="start-search">Start search!</div>
                        </div>
                }
            </div>
        );
    }
}
