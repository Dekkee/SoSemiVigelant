import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

import reducer from '../reducers'

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
    reducer,
    {
        auctions: {
            isFetching: false,
            didInvalidate: true,
            items: []
        }
    },
    applyMiddleware(...middleware)
)

export default store;