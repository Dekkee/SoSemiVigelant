import * as React from 'react';
import * as cn from 'classnames';
import { ChangeEvent } from "react";
import { debounce } from 'lodash';
import { ParsedRow } from "./entities/Row";
import { CardLayout } from "./components/CardLayout/CardLayout";

import './App.scss';

interface IState {
    rows: ParsedRow[]
}

const url = process.env.NODE_ENV === 'production'
    ? ''
    : '//localhost:8081';

export class App extends React.Component<{}, IState> {
    constructor (props) {
        super(props);

        this.state = {
            rows: []
        }
    }

    requestData = debounce(async (value: string) => this.setState({ rows: await (await fetch(`${url}/api?name=${value}`)).json() as ParsedRow[] }), 300);

    onInput = (e: ChangeEvent) => this.requestData((e.target as HTMLInputElement).value);

    render () {
        const { rows } = this.state;
        return (
            <>
                <label>
                    Search:
                    <input onChange={ (e) => this.onInput(e) }/>
                </label>
                {
                    rows.length
                        ?
                        // ? <div className="cards-container">
                        //     <span>Name</span>
                        //     <span>Category</span>
                        //     <span>Rarity</span>
                        //     <span>Condition</span>
                        //     <span>Price</span>
                        //    {
                                rows.map((row, i) => <CardLayout className={ cn({ "card-layout--dark": i % 2 }) }
                                                                 card={ row }
                                                                 key={ i }/>)
                        //    }
                        // </div>
                        : <div>empty</div>

                }
            </>
        );
    }
}
