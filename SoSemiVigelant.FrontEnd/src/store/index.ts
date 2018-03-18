import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

import { reducer } from '../reducers';

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}

export const store = createStore(
    reducer, {
        auctions: {
            isFetching: false,
            items: [],
            page: 0,
            perPage: 20,
            sortOrder: 'estimated',
            sortDirection: true
        }
    },
    applyMiddleware(...middleware)
);
