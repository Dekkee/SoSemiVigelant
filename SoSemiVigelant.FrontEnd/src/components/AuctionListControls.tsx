import * as React from 'react';

import { Pagination } from './Pagination';
import debounce = require('lodash/debounce');

export interface Props {
    count: number;
    page: number;
    pageSize: number;
    showSearchInput?: boolean;
    onPageSizeChanged: (pageSize: number) => void;
    onPageChanged: (page: number) => void;
    onSearchTextChange?: (val: number) => void;
}

interface State {
    options: {
        value: number;
        label: string;
    }[]
}

export class AuctionListControls extends React.Component<Props, State> {

    private onSearchTextChange: (val: number) => void;

    constructor (props) {
        super(props);

        this.state = {
            options: [
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 30, label: '30' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
                //{ value: null, label: 'Все' },
            ]
        };

        this.onSearchTextChange = debounce((val) => {
            props.onSearchTextChange(val);
        }, 200);
    }

    render () {
        const { count, page, pageSize, showSearchInput } = this.props;
        const { options } = this.state;

        return (
            <div className="pagination-container">
                <div className="pagination-count">Всего: {count}</div>
                {
                    showSearchInput && <div className="pagination-search-input">
                        <i className="material-icons">search</i>
                        <input type="text" placeholder="Поиск..." onChange={this.handleSearchTextChange.bind(this)}/>
                    </div>
                }
                <Pagination count={count} page={page} pageSize={pageSize}
                            clickCallback={this.handlePageChange.bind(this)}/>
                <select className="pagination-page-size-select" onChange={this.handlePageSizeChanged.bind(this)}
                        value={pageSize}>
                    {
                        options.map((opt, i) => (<option value={opt.value} key={i}>{opt.label}</option>))
                    }
                </select>
            </div>
        );
    }

    private handleSearchTextChange (event) {
        this.onSearchTextChange(event.target.value);
    }

    private handlePageChange (data) {
        this.props.onPageChanged(data.selected);
    }

    private handlePageSizeChanged (event) {
        this.props.onPageSizeChanged(event.target.value);
    }
}
