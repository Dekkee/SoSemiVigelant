import sagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, Store } from 'redux';

import { IState, reducer } from '../reducers';
import { root } from '../sagas';

export const configureStore = (): Store<IState> => {
    const sagaMW = sagaMiddleware();

    const middleware = [sagaMW];

    if (process.env.NODE_ENV !== 'production') {
        middleware.push(createLogger())
    }

    const store = createStore<IState>(
        reducer, applyMiddleware(...middleware)
    );

    sagaMW.run(root);

    return store;
};
