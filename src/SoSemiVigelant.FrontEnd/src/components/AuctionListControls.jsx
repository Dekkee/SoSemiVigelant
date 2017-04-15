import React, { PropTypes } from 'react'

import { Pagination } from './pagination'

class AuctionListControls extends React.Component{
    static PropTypes  = {
        count: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        perPage: PropTypes.number.isRequired,
        onPageSizeChanged: PropTypes.func,
        onPageChanged: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.options = [ 
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 30, label: '30' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            //{ value: null, label: 'Все' },
         ];

        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChanged = this.handlePageSizeChanged.bind(this);
    }

    handlePageChange(data) {
        this.props.onPageChanged(data.selected);
    }

    handlePageSizeChanged(event) {
        console.log(event.target);
        console.log(event.target.value);
        this.props.onPageSizeChanged(event.target.value);
    }

    render() {
        const { count, page, perPage } = this.props;
        const options = this.options;

        return (
            <div className="pagination-container">
                <div className="pagination-count">Всего: {count}</div>
                <Pagination count={count} page={page} pageSize={perPage} clickCallback={this.handlePageChange} />
                <select className="pagination-page-size-select" onChange={this.handlePageSizeChanged} value={perPage}>
                {
                    options.map((opt, i) => (<option value={opt.value} key={i}>{opt.label}</option>))
                }
                </select>
            </div>
        );
    }
}

export default AuctionListControls;