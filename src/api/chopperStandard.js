import request from "@/utils/request";

export function getChopperStandardList({ page, size }) {
  return request({
    url: "/chopperStandard/",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

export function createChopperStandard({
  is_show,
  show_type,
  standard,
  chopper_code,
  parameter_code,
}) {
  return request({
    url: "/chopperStandard/",
    method: "post",
    data: {
      is_show,
      show_type,
      standard,
      chopper_code,
      parameter_code,
    },
  });
}

export function updateChopperStandard({
    id,
    is_show,
    show_type,
    standard,
    chopper_code,
    parameter_code,
}) {
    return request({
        url: `/chopperStandard/${id}/`,
        method: 'put',
        data: {
            is_show,
            show_type,
            standard,
            chopper_code,
            parameter_code,
        }
    })
}


export function deleteChopperStandard({
    id
}) {
    return request({
        url: `/chopperStandard/${id}/`,
        method: 'delete'
    })
}
