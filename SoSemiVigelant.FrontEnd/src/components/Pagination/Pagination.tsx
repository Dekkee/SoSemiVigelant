import * as React from 'react';
import * as ReactPaginate from 'react-paginate';

import './Pagination.scss';

export interface Props {
    count: number;
    page: number;
    pageSize: number;
    clickCallback: () => void;
}

export class Pagination extends React.Component<Props> {

    constructor (props) {
        super(props);
    }

    render () {
        const { count, page, pageSize, clickCallback } = this.props;
        if (!count) {
            return null;
        }

        const pageCount = Math.ceil(count / pageSize);
        if (pageCount === 1) {
            return null;
        }
        return <ReactPaginate
            disableInitialCallback={true}
            onPageChange={clickCallback}
            previousLabel={<i className="material-icons">navigate_before</i>}
            nextLabel={<i className="material-icons">navigate_next</i>}
            breakLabel={<i className="material-icons">more_horiz</i>}
            breakClassName={'break'}
            pageCount={pageCount}
            forcePage={page}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            containerClassName={'pagination pagination--custom text-center'}
            activeClassName={'current'}
            disabledClassName={'disabled'}
            previousClassName={'pagination-previous'}
            nextClassName={'pagination-next'}/>;
    }
}
