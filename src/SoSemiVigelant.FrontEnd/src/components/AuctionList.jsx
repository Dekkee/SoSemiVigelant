import React, { PropTypes } from 'react'
import classNames from 'classnames'

import { fetchAucsIfNeeded } from '../actions'
import AuctionItemContainer from '../containers/AuctionItemContainer'
import AuctionListControlsContainer from '../containers/AuctionListControlsContainer'
import { Modal } from './modal'

class AuctionList extends React.Component{
  static propTypes = {
        items: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        page: PropTypes.number.isRequired,
        perPage: PropTypes.number.isRequired,
        sortOrder: PropTypes.string.isRequired,
        sortDirection: PropTypes.bool.isRequired,
        searchText: PropTypes.string
    }

  constructor(props) {
    super(props)

    this.perPage = 20;
    
    this.columns = [
      { 
        name: 'name',
        label: 'Название'  
      }, 
      { 
        name: 'timeLeft',
        label: 'До конца'  
      }, 
      { 
        name: 'currentBet',
        label: 'Ставка'  
      }
    ];

    this.handleSort = this.handleSort.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
  }

  componentDidMount() {
    const { loadAucs, page, perPage, sortOrder, sortDirection, searchText } = this.props;
    loadAucs({
      page,
      perPage,
      sortOrder,
      sortDirection,
      searchText
    });
  }

  componentWillReceiveProps(nextProps) {
    if (/*nextProps.selectedReddit !== this.props.selectedReddit*/true) {
      // const { loadAucs } = this.props;
      // const request = {
      //   page: this.page,
      //   perPage: this.perPage
      // }
      //loadAucs(request);
    }
  }

  handlePageChange(page) {
    const { loadAucs, sortOrder, sortDirection, perPage, searchText } = this.props;
    loadAucs({
      page,
      perPage,
      sortOrder,
      sortDirection,
      searchText
    });
  }

  handlePageSizeChange(perPage) {
    const { loadAucs, sortOrder, sortDirection, page, searchText } = this.props;
    loadAucs({
      page,
      perPage,
      sortOrder,
      sortDirection,
      searchText
    });
  }

  handleSearchTextChange(searchText) {
    const { loadAucs, sortOrder, sortDirection, page, perPage } = this.props;
    loadAucs({
      page,
      perPage,
      sortOrder,
      sortDirection,
      searchText
    });
  }

  handleSort(obj) {
    const { loadAucs, sortOrder, page, sortDirection, perPage, searchText } = this.props;
    let direction = true;

    if (sortOrder === obj) {
       direction = !sortDirection;
    }
    
    loadAucs({
      page,
      perPage,
      sortOrder: obj,
      sortDirection: direction,
      searchText
    });
  }

  render() {
    const { items, isFetching, lastUpdated, count, page, perPage, sortOrder, sortDirection } = this.props;
    const isEmpty = !!items && items.length === 0;
    const columns = this.columns;
    return (
      <div>
        <div className="auctionList" style={{ opacity: isFetching ? 0.5 : 1 }}>
          <AuctionListControlsContainer 
            count={count} 
            page={page} 
            pageSize={perPage} 
            onPageSizeChanged={this.handlePageSizeChange} 
            onPageChanged={this.handlePageChange}
            onSearchTextChange={this.handleSearchTextChange}
            showSearchInput={true}/>
          
            <div className="auctionList-header">
            {
                columns.map((column, i) => {
                  const cn = classNames(
                    'auctionList-header-item',
                    `auctionList-header-item-${column.name}`,
                    `auction-column-${column.name}`,
                    {
                    'sort-by': sortOrder === column.name && sortDirection,
                    'sort-by-desc': sortOrder === column.name && !sortDirection
                    }
                  );
                  return <span className={cn} onClick={() => this.handleSort(column.name)} key={i}>{column.label}</span>;
                })
            }
            </div>
            {
              isFetching 
                ? <h2 className="loading">Loading...</h2> : 
                isEmpty ? <h2>Empty.</h2> 
                : 
                items.map((auc, i) =>
                    <AuctionItemContainer 
                      {...auc}
                      key={i}/>
                )
            }
            <AuctionListControlsContainer 
              count={count} 
              page={page} 
              pageSize={perPage} 
              onPageSizeChanged={this.handlePageSizeChange} 
              onPageChanged={this.handlePageChange}/>
        </div>
      </div>
    );
  }
} 

export default AuctionList
