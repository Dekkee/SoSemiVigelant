import { Action, Reducer as ReduxReducer } from 'redux';
import { ActionCreator } from '../../actions/actionCreatorFactory';

export type Reducer<S, R> = (state: S, action: R & Action) => S;

export type SwitchCase<S, R> = Record<string, Reducer<S, R>>;

export const switchCase = <R> (actionCreator: ActionCreator<R>) => <S> (reducer: Reducer<S, R>): SwitchCase<S, R> => ({
    [actionCreator.type]: reducer,
});

export const switchMultipleCase = <R> (actionCreators: Array<ActionCreator<R>>) =>
    <S> (reducer: Reducer<S, R>): SwitchCase<S, R> => actionCreators.reduce((acc, val) => {
        acc[val.type] = reducer;
        return acc;
    }, {});

export const switchReducer = <S> (reducers: Record<string, ReduxReducer<S>>, initialState?: S): ReduxReducer<S> =>
    (state = initialState, action: Action) => {
        const reducer = reducers[action.type];
        return reducer ? reducer(state, action) : state;
    };
