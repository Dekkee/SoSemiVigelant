import join from 'lodash-es/join';;
import compact from 'lodash-es/compact';
import map from 'lodash-es/map';

import * as fetch from 'isomorphic-fetch';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IResponseStatus {
    status: number;
    statusText: string;
}

export interface IErrorResponse extends IResponseStatus {
    code: number;
    error: string;
    msg: string;
}

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

export const getQuery = (obj: any): string => (join(compact(map(obj, (val, key) => val ? `${key}=${val}` : undefined)), '&'));

export interface TakeSkipQuery {
    take: number;
    skip: number;
}

export const getTakeSkipQuery = (totalPages: number, page: number): TakeSkipQuery =>
    ({ take: totalPages, skip: Math.ceil(page * totalPages) });

export const getTakeSkipQueryString = (totalPages: number, page: number): string =>
    getQuery(getTakeSkipQuery(totalPages, page));

export const getJson = (url: string, data?: any): Promise<any> =>
    fetch(resolveUrl(url), data)
        .then(checkStatus)
        .then(respToJson);
