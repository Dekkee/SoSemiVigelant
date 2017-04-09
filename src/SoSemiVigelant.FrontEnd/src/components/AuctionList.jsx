import React, { PropTypes } from 'react'

import { fetchAucsIfNeeded } from '../actions'
import AuctionItemContainer from '../containers/AuctionItemContainer'
import { Modal } from './modal'
import { Pagination } from './pagination'

class AuctionList extends React.Component{
  static propTypes = {
        items: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        page
    }

  constructor(props) {
    super(props)

    this.perPage = 20;
    
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    const { loadAucs } = this.props;
    const request = {
      page: 0,
      perPage: this.perPage
    }
    loadAucs(request);
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
    const { loadAucs } = this.props;
    const request = {
      page: data.selected,
      perPage: this.perPage
    }
    loadAucs(request);
  }

  render() {
    const { items, isFetching, lastUpdated, count, page } = this.props;
    const isEmpty = !!items && items.length === 0;
    return (
      <div>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <div className="pagination-container">
                <Pagination count={count} page={page} pageSize={this.perPage} clickCallback={this.handlePageChange} />
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
