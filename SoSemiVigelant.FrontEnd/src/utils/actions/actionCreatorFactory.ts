import { Action, ActionCreator as ReduxActionCreator, Func0, Func1, Func2, Func3 } from 'redux';

import forEach from 'lodash-es/forEach';

const actionCreatorTypeId = Symbol('action_creator_type_id');

export type ActionInfo = Action;

export type ActionCreator<R = {}> = ReduxActionCreator<R & Action> & ActionInfo;

export interface ActionCreatorFactory {
    <R> (creator: Func0<R>): Func0<R & Action> & ActionInfo;

    <T1, R> (creator: Func1<T1, R>): Func1<T1, R & Action> & ActionInfo;

    <T1, T2, R> (creator: Func2<T1, T2, R>): Func2<T1, T2, R & Action> & ActionInfo;

    <T1, T2, T3, R> (creator: Func3<T1, T2, T3, R>): Func3<T1, T2, T3, R & Action> & ActionInfo;
}

export const action: ActionCreatorFactory = (create: any) => {
    const creator: ActionCreator = <any> ((...args: any[]): Action => ({
        ...create(...args),
        type: creator.type,
    }));
    (creator as any)[actionCreatorTypeId] = 1;
    return creator;
};

export const isActionCreator = (x: any): x is ActionCreator => (
    typeof x === 'function' && actionCreatorTypeId in x
);

export const initActionCreators = (prefix: string, dict: Record<string, any>) => {
    const keys = Object.keys(dict);
    keys.forEach((key: string) => {
        if (isActionCreator(dict[key])) {
            dict[key].type = `${prefix}${key}`;
        } else if (dict[key] && typeof dict[key] === 'object') {
            initActionCreators(`${prefix}${key}.`, dict[key]);
        }
    });
};
