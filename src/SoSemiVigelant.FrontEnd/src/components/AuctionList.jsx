import React, { PropTypes } from 'react'

import { fetchAucsIfNeeded } from '../actions'
import AuctionItemContainer from '../containers/AuctionItemContainer'
import { Modal } from './modal'

class AuctionList extends React.Component{
  static propTypes = {
        items: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number
    }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { loadAucs } = this.props;
    loadAucs(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (/*nextProps.selectedReddit !== this.props.selectedReddit*/true) {
      const { loadAucs } = this.props;
      loadAucs(this.props);
    }
  }



  render() {
    const { items, isFetching, lastUpdated } = this.props;
    const isEmpty = !!items && items.length === 0;
    return (
      <div>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              {
                items.map((auc, i) =>
                    <AuctionItemContainer 
                      name={auc.name} 
                      key={i}
                      id={auc.id}/>
                )
              }
          </div>
        }
      </div>
    );
  }
} 

export default AuctionList
