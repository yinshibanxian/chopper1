import request from "@/utils/request";

export function createSpect({ spect_code, spect_name }) {
  return request({
    url: "/spect/",
    method: "post",
    data: {
      spect_code,
      spect_name,
    },
  });
}

export function getSpectList({ page, size }) {
  return request({
    url: "/spect/",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

export function deleteSpect({ id }) {
  return request({
    url: `/spect/${id}/`,
    method: "delete"
  });
}

export function updateSpect({ id, spect_code, spect_name }) {
  return request({
    url: `/spect/${id}/`,
    method: "put",
    data: {
      spect_code,
      spect_name,
    },
  });
};

export function searchSpectById(id) {
  return request({
    url: `/spect/${id}/`,
    method: 'get'
  })
}
