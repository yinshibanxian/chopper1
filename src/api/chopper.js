import request from "@/utils/request";

export function createChopper({
  chopper_code,
  chopper_name,
  is_in_service,
  motor_model,
  normal_color,
  alarm_color,
  error_color,
  spect_code,
}) {
  return request({
    url: "/chopper/",
    method: "post",
    data: {
      chopper_code,
      chopper_name,
      is_in_service,
      motor_model,
      normal_color,
      alarm_color,
      error_color,
      spect_code,
    },
  });
}

export function getChopperList({ page, size, spect_code }) {
  return request({
    url: "/chopper/",
    method: "get",
    params: {
      page,
      size,
      spect_code
    },
  });
}

export function deleteChopper({ id }) {
  return request({
    url: `/chopper/${id}/`,
    method: "delete",
  });
}

export function updateChopper({
  id,
  chopper_code,
  chopper_name,
  is_in_service,
  motor_model,
  normal_color,
  alarm_color,
  error_color,
  spect_code,
}) {
  return request({
    url: `/chopper/${id}/`,
    method: 'put',
    data: {
      chopper_code,
      chopper_name,
      is_in_service,
      motor_model,
      normal_color,
      alarm_color,
      error_color,
      spect_code,
    }
  })
}
