import { getJson, getQuery, getTakeSkipQuery, getTakeSkipQueryString } from '../api/core'

export const REQUEST_AUCS = 'REQUEST_AUCS'
export const RECEIVE_AUCS = 'RECEIVE_AUCS'
export const INVALIDATE_AUCS = 'INVALIDATE_AUCS'
export const REQUEST_AUC = 'REQUEST_AUC'
export const RECEIVE_AUC = 'RECEIVE_AUC'
export const CLOSE_AUC_MODAL = 'CLOSE_AUC_MODAL'

const requestAucs = props => ({
    type: REQUEST_AUCS,
    ...props
})

const receiveAucs = (json) => ({
    type: RECEIVE_AUCS,
    values: json.result,
    count: json.count,
    receivedAt: Date.now()
})

const requestAuc = (id) => ({
    type: REQUEST_AUC,
    id
})

const receiveAuc = (id, json) => ({
    type: RECEIVE_AUC,
    id,
    auction: json.result,
    receivedAt: Date.now()
})

const closeAuc = () => ({
    type: CLOSE_AUC_MODAL
})

const fetchAucs = props => dispatch => {
    dispatch(requestAucs(props));

    const paging = props.perPage ?
        getTakeSkipQuery(props.perPage, props.page) : { full: "true" };

    const params = {
        ...paging,
        order: props.sortOrder,
        asc: props.sortDirection.toString(),
        name: props.searchText
    };

    return getJson(`aucs/list?${getQuery(params)}`)
        .then(json => {
            dispatch(receiveAucs(json))
        })
}

const shouldFetchAucs = (state) => {
    const aucs = state.auctions
    return !aucs.isFetching;
}

export const fetchAucsIfNeeded = props => (dispatch, getState) => {
    if (shouldFetchAucs(getState())) {
        return dispatch(fetchAucs(props))
    }
}

export const fetchAucInfo = id => (dispatch, getState) => {
    dispatch(requestAuc(id))
    return getJson(`aucs/get?id=${id}`)
        .then(json => {
            dispatch(receiveAuc(id, json))
        })
}

export const closeAucModal = () => (dispatch, getState) => dispatch(closeAuc());