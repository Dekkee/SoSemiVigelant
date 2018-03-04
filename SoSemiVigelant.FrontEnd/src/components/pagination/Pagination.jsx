import React from 'react';
import PropTypes from 'prop-types';
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
                    nextClassName={'pagination-next'} />;
    }
};
