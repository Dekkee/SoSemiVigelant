import React, { PropTypes } from 'react'
import classNames from 'classnames'

import { fetchAucsIfNeeded } from '../actions'
import AuctionItemContainer from '../containers/AuctionItemContainer'
import { Modal } from './modal'
import { Pagination } from './pagination'

class AuctionList extends React.Component{
  static propTypes = {
        items: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        page: PropTypes.number.isRequired,
        sortOrder: PropTypes.string.isRequired,
        sortDirection: PropTypes.bool.isRequired
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

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    const { loadAucs, page, sortOrder, sortDirection } = this.props;
    loadAucs({
      page,
      perPage: this.perPage,
      sortOrder,
      sortDirection
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

  handlePageChange(data) {
    const { loadAucs, sortOrder, sortDirection } = this.props;
    loadAucs({
      page: data.selected,
      perPage: this.perPage,
      sortOrder,
      sortDirection
    });
  }

  handleSort(obj) {
    console.log(obj);
    const { loadAucs, sortOrder, page, sortDirection } = this.props;
    let direction = true;
    if (sortOrder === obj) {
       direction = !sortDirection;
    }
    loadAucs({
      page,
      perPage: this.perPage,
      sortOrder: obj,
      sortDirection: direction
    });
  }

  render() {
    const { items, isFetching, lastUpdated, count, page, sortOrder, sortDirection } = this.props;
    const isEmpty = !!items && items.length === 0;
    const columns = this.columns;
    return (
      <div>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div className="auctionList" style={{ opacity: isFetching ? 0.5 : 1 }}>
              <div className="pagination-container">
                <Pagination count={count} page={page} pageSize={this.perPage} clickCallback={this.handlePageChange} />
              </div>
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
                items.map((auc, i) =>
                    <AuctionItemContainer 
                      {...auc}
                      key={i}/>
                )
              }
              <div className="pagination-container">
                <Pagination count={count} page={page} pageSize={this.perPage} clickCallback={this.handlePageChange} />
              </div>
          </div>
        }
      </div>
    );
  }
} 

export default AuctionList
