import { Reducer } from 'redux';
import debounce = require('lodash/debounce');

/**
 * Интерфейс сериализатора значения в строку.
 */
export interface ISerializer<TValue> {
    parse(str: string): TValue;

    stringify(value: TValue): string;
}

/**
 * Сериализатор по умолчанию. Сериализует значение в JSON-строку.
 */
const defaultSerializer: ISerializer<any> = {
    parse: JSON.parse,
    stringify: JSON.stringify,
};

/**
 * @summary Декоратор редьюсера. Хранит состояние между запусками приложения.
 * @description
 * Сохраняет состояние по заданному ключу {@param key} в локальное хранилище
 * и восстанавлиет оттуда, если состояние не задано ({undefined}).
 * @param {string} key ключ
 * @param {Reducer<S>} reducer редьюсер
 * @param {ISerializer<S>} [serializer={@link defaultSerializer}] сериализатор состояния
 * @returns {Reducer<S>}
 */
export const persistReducer = <S> (key: string,
                                   reducer: Reducer<S>,
                                   serializer: ISerializer<S> = defaultSerializer): Reducer<S> => {
    const getItem = () => {
        try {
            const value = localStorage.getItem(key);
            if (value !== null) {
                return serializer.parse(value);
            }
        } catch (e) {
            // ignore
        }
    };

    const setItem = debounce((value) => {
        try {
            return localStorage.setItem(key, serializer.stringify(value));
        } catch (e) {
            // ignore
        }
    }, 100, {
        leading: true,
        trailing: true,
        maxWait: 200,
    });

    return (state = getItem(), action) => {
        const newState = reducer(state, action);
        if (newState !== state) {
            setItem(newState);
        }
        return newState;
    };
};
