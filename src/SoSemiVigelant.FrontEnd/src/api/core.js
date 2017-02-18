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

export function getJson(url){
    return fetch(
        resolveUrl(url))
        .then(checkStatus)
        .then(respToJson);
}