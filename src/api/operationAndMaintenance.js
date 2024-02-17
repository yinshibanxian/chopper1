import request from "@/utils/request";
export function getOperationAndMaintenanceList({
  page,
  size,
  chopper_code,
  start_time,
  end_time,
  sort,
}) {
  return request({
    url: "/operationAndMaintenance/",
    method: "get",
    params: {
      page,
      size,
      chopper_code,
      sort,
      start_time,
      end_time
    },
  });
}

export function createOperationAndMaintenance({
  chopper_code,
  event_name,
  event_type,
  event_describe,
  total_online_time,
  error_type,
  backup,
  total_error_time,
  total_beam_time,
}) {
  return request({
    url: "/operationAndMaintenance/",
    method: "post",
    data: {
      chopper_code,
      event_name,
      event_type,
      event_describe,
      total_online_time,
      error_type,
      backup,
      total_error_time,
      total_beam_time,
    },
  });
}

export function updateOperationAndMainTenance({
  id,
  chopper_code,
  event_name,
  event_type,
  event_describe,
  total_online_time,
  error_type,
  backup,
  total_error_time,
  total_beam_time,
}) {
  return request({
    url: `/operationAndMaintenance/${id}/`,
    method: "put",
    data: {
      chopper_code,
      event_name,
      event_type,
      event_describe,
      total_online_time,
      error_type,
      backup,
      total_error_time,
      total_beam_time,
    },
  });
}


export function deleteOperationAndMaintenance({ id }) {
    return request({
        url: `/operationAndMaintenance/${id}/`,
        method: 'delete'
    })
}
