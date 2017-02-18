import React, { PropTypes } from 'react'

import { fetchAucsIfNeeded } from '../actions'
import AuctionItem from './AuctionItem'

class AuctionList extends React.Component{
  static propTypes = {
        items: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired
    }

  constructor(props) {
    super(props)

  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchAucsIfNeeded(this.props))
  }

  componentWillReceiveProps(nextProps) {
    if (/*nextProps.selectedReddit !== this.props.selectedReddit*/true) {
      const { dispatch } = nextProps
      dispatch(fetchAucsIfNeeded(this.props))
    }
  }

  render() {
    const { items, isFetching, lastUpdated } = this.props;
    const isEmpty = !!items && items.length === 0;
    return (
    <ul>
      {isEmpty
        ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
        : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            {
              items.map((auc, i) =>
                <li key={i}>
                  <AuctionItem 
                    name={auc.name} 
                    id={i}/>
                </li>
              )
            }
        </div>
      }
    </ul>
    );
  }
} 

export default AuctionList
