import { map } from '../common/fp';
import { flow, compact, join } from 'lodash/fp';
import fetch from 'isomorphic-fetch';

var endPoint = "http://localhost:65107";

const respToJson = response => response.json();

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function resolveUrl(url) {
    return `${endPoint}/${url}`;
}

export const getQuery = flow(
    map((val, key) => val ? `${key}=${val}` : undefined),
    compact,
    join('&'),
);

export function getTakeSkipQuery(pagecount, page) {
    return { take: pagecount, skip: Math.ceil(page * pagecount) };
}

export function getTakeSkipQueryString(pagecount, page) {
    return getQuery(getTakeSkipQuery(pagecount, page));
}

export function getJson(url, data) {
    return fetch(resolveUrl(url), data)
        .then(checkStatus)
        .then(respToJson);
}