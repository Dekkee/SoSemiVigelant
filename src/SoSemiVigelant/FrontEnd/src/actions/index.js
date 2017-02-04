import { getJson } from '../api/core'

export const REQUEST_AUCS = 'REQUEST_AUCS'
export const RECEIVE_AUCS = 'RECEIVE_AUCS'
export const INVALIDATE_AUCS = 'INVALIDATE_AUCS'
export const REQUEST_AUC = 'REQUEST_AUC'
export const RECEIVE_AUC = 'RECEIVE_AUC'

export const requestAucs = () => ({
  type: REQUEST_AUCS
})

export const receiveAucs = (json) => ({
  type: RECEIVE_AUCS,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
})

const fetchAucs = () => dispatch => {
  dispatch(requestAucs())
  return fetch(getJson('aucs/values'))
    .then(response => response.json())
    .then(json => dispatch(receiveAucs(json)))
}

const shouldFetchAucs = (state,) => {
  const aucs = state.getAucs
  if (!aucs) {
    return true
  }
  if (aucs.isFetching) {
    return false
  }
  return aucs.didInvalidate
}

export const fetchAucsIfNeeded = reddit => (dispatch, getState) => {
  if (shouldFetchAucs(getState(), reddit)) {
    return dispatch(fetchAucs(reddit))
  }
}