import { getJson } from '../api/core'

export const REQUEST_AUCS = 'REQUEST_AUCS'
export const RECEIVE_AUCS = 'RECEIVE_AUCS'
export const INVALIDATE_AUCS = 'INVALIDATE_AUCS'
export const REQUEST_AUC = 'REQUEST_AUC'
export const RECEIVE_AUC = 'RECEIVE_AUC'
export const CLOSE_AUC_MODAL = 'CLOSE_AUC_MODAL'

const requestAucs = () => ({
  type: REQUEST_AUCS
})

const receiveAucs = (json) => ({
  type: RECEIVE_AUCS,
  values: json.result,
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

const fetchAucs = () => dispatch => {
  dispatch(requestAucs())
  return getJson('aucs/list')
    .then(json => {
      dispatch(receiveAucs(json))
  })
}

const shouldFetchAucs = (state) => {
  const aucs = state.auctions
  if (!aucs) {
    return true
  }
  if (aucs.isFetching) {
    return false
  }
  return aucs.didInvalidate
}

export const fetchAucsIfNeeded = values => (dispatch, getState) => {
  if (shouldFetchAucs(getState(), values)) {
    return dispatch(fetchAucs(values))
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