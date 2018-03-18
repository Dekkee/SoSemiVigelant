import { flow, compact, join } from 'lodash/fp';
import * as fetch from 'isomorphic-fetch';

import { map } from '../utils/fp';

const endPoint = process.env.API_HOST && process.env.HOST_PORT ?
    `http://${process.env.API_HOST}:${process.env.HOST_PORT}` :
    'api';

const respToJson = (response: any) => response.json();

const checkStatus = (response: any): any => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(response.statusText);
        (error as any).response = response;
        throw error
    }
};

export function resolveUrl (url: string): string {
    return `${endPoint}/${url}`;
}

export const getQuery: (obj: any) => string = flow(
    map((val, key) => val ? `${key}=${val}` : undefined),
    compact,
    join('&'),
);

export interface TakeSkipQuery {
    take: number;
    skip: number;
}

export function getTakeSkipQuery (totalPages: number, page: number): TakeSkipQuery {
    return { take: totalPages, skip: Math.ceil(page * totalPages) };
}

export function getTakeSkipQueryString (totalPages: number, page: number): string {
    return getQuery(getTakeSkipQuery(totalPages, page));
}

export function getJson (url: string, data?: any): Promise<any> {
    return fetch(resolveUrl(url), data)
        .then(checkStatus)
        .then(respToJson);
}
