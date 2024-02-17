import request from '@/utils/request';

export function createH5(data) {
  return request({
    url: '/data/import/',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function getChopperHistoryData({
  chopper_standard_id_list,
  start_time,
  end_time
}) {
  return request({
    url: '/data/',
    method: 'get',
    params: {
      chopper_standard_id_list: chopper_standard_id_list,
      start_time,
      end_time
    }
  })
}