import request from '@/utils/request'

export function getJobList(params) {
  return request({
    url: '/job/list',
    method: 'get',
    params
  })
}

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function getDbInfoList(params) {
  return request({
    url: '/dbinfo/list',
    method: 'get',
    params
  })
}

export function getHistoryList(params) {
  return request({
    url: '/taskresult/list',
    method: 'get',
    params
  })
}
