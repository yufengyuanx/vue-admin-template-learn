import request from '@/utils/request'

export function getJobList(params) {
  return request({
    url: '/job/list',
    method: 'get',
    params
  })
}

export function getUserList() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function getDbInfoList() {
  return request({
    url: '/dbInfo/list',
    method: 'get'
  })
}
