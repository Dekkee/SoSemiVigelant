import React, { PropTypes } from 'react'

const Auctions = ({aucs}) => (
  <ul>
    {aucs.map((auc, i) =>
      <li key={i}><a href={auc.url}>{auc.name}</a></li>
    )}
  </ul>
)

Auctions.propTypes = {
  aucs: PropTypes.array.isRequired
}

export default Auctions
