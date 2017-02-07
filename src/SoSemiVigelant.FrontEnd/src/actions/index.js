import { getJson } from '../api/core'

export const REQUEST_AUCS = 'REQUEST_AUCS'
export const RECEIVE_AUCS = 'RECEIVE_AUCS'
export const INVALIDATE_AUCS = 'INVALIDATE_AUCS'
export const REQUEST_AUC = 'REQUEST_AUC'
export const RECEIVE_AUC = 'RECEIVE_AUC'

export const requestAucs = aucs => ({
  type: REQUEST_AUCS,
  aucs
})

export const receiveAucs = (aucs, json) => ({
    type: RECEIVE_AUCS,
    aucs: json.result,
    receivedAt: Date.now()
  })

const fetchAucs = aucs => dispatch => {
  dispatch(requestAucs(aucs))
  return getJson('aucs/list')
    .then(json => {
      dispatch(receiveAucs(aucs, json))
  })
}

const shouldFetchAucs = (state) => {
  const aucs = state.getAucs['data']
  if (!aucs) {
    return true
  }
  if (aucs.isFetching) {
    return false
  }
  return aucs.didInvalidate
}

export const fetchAucsIfNeeded = aucs => (dispatch, getState) => {
  if (shouldFetchAucs(getState(), aucs)) {
    return dispatch(fetchAucs(aucs))
  }
}