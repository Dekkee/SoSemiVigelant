import React, { PropTypes } from 'react';
import ReactPaginate from 'react-paginate';

export class Pagination extends React.Component{
    static propTypes = {
        count: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        clickCallback: PropTypes.func.isRequired
    }

    constructor(props) {
            super(props);
    }
    
    render() {
        const { count, page, pageSize, clickCallback } = this.props;
        if(!count) {
            return null;
        }
        
        const pageCount = Math.ceil(count / pageSize);
        if(pageCount === 1) {
            return null;
        }
        return <ReactPaginate
                    disableInitialCallback={true}
                    onPageChange={clickCallback}
                    previousLabel={'<<'}
                    nextLabel={'>>'}
                    breakLabel={'...'}
                    breakClassName={'break'}
                    pageCount={pageCount}
                    forcePage={page}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}                    
                    containerClassName={'pagination pagination--custom text-center'}
                    activeClassName={'current'}
                    disabledClassName={'disabled'}
                    previousClassName={'pagination-previous'}
                    nextClassName={'pagination-next'} />;
    }
};