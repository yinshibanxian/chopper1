import request from "@/utils/request";

export function getStandardList({ page, size }) {
  return request({
    url: "/standard/",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

export function createStandard({
  parameter_code,
  parameter_name,
}) {
  return request({
    url: "/standard/",
    method: "post",
    data: {
      parameter_code,
      parameter_name,
    },
  });
}

export function updateStandard({
  id,
  parameter_code,
  parameter_name,
  parameter_field,
}) {
  return request({
    url: `/standard/${id}/`,
    method: "put",
    data: {
      parameter_code,
      parameter_name,
      parameter_field,
    },
  });
}

export function deleteStandard({ id }) {
  return request({
    url: `/standard/${id}/`,
    method: "delete",
  });
}
