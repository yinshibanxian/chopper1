import request from '@/utils/request';
import axios from 'axios';

const baseURL = 'http://47.115.49.59:8000/api';

export function getAlgorithmList(page = 1) {
  // return request.get({
  //   url: '/algorithm/',
  //   method: 'get',
  //   params
  // })
  return request({
    method: 'get',
    url: `/algorithm/?page=1`,
    withCredentials: true
  })
}
