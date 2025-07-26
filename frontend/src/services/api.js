import axiosInstance from './axiosInstance'

export function postAction(url, parameter, headers) {
  return axiosInstance({
    url: url,
    method: 'post',
    data: parameter,
    headers: headers ? headers : {}
  })
}

export function getAction(url, parameter, headers) {
  return axiosInstance({
    url: url,
    method: 'get',
    params: parameter,
    headers: headers ? headers : {}
  })
}

export function deleteAction(url, parameter) {
  return axiosInstance({
    url: url,
    method: 'DELETE',
    params: parameter
  })
}