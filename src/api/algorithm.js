import request from '@/utils/request';


export function getAlgorithmList({ page, size }) {
  return request({
    method: 'get',
    url: `/algorithm/`,
    params: {
      page,
      size
    }
  })
}


export function createAlgorithm(data) {
  return request({
    method: 'post',
    url: '/algorithm/',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

