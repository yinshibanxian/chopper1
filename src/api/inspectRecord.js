import request from "@/utils/request";

export function createInspectRecord({
  chopper_code,
  running_speed,
  running_temp,
  running_vibration,
  running_veto_rate,
  running_time_week,
  running_other,
  working_condition,
  working_status,
  working_other,
  cool_temp,
  cool_heat,
  cool_flux,
  cool_water_level,
  cool_other,
  electrical_control_cabinet,
  electrical_vacuum_pump,
  electrical_chiller,
  error_record,
  other,
}) {
  return request({
    url: "/inspectRecord/",
    method: "post",
    data: {
      chopper_code,
      running_speed,
      running_temp,
      running_vibration,
      running_veto_rate,
      running_time_week,
      running_other,
      working_condition,
      working_status,
      working_other,
      cool_temp,
      cool_heat,
      cool_flux,
      cool_water_level,
      cool_other,
      electrical_control_cabinet,
      electrical_vacuum_pump,
      electrical_chiller,
      error_record,
      other,
    },
  });
}

export function getInspectRecordList({ page, size }) {
  return request({
    url: "/inspectRecord/",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

export function deleteInspectRecord({ id }) {
  return request({
    url: `/inspectRecord/${id}/`,
    method: "delete",
  });
}

export function updateInspectRecord({
  id,
  chopper_code,
  running_speed,
  running_temp,
  running_vibration,
  running_veto_rate,
  running_time_week,
  running_other,
  working_condition,
  working_status,
  working_other,
  cool_temp,
  cool_heat,
  cool_flux,
  cool_water_level,
  cool_other,
  electrical_control_cabinet,
  electrical_vacuum_pump,
  electrical_chiller,
  error_record,
  other,
}) {
  return request({
    url: `/inspectRecord/${id}/`,
    method: "put",
    data: {
      chopper_code,
      running_speed,
      running_temp,
      running_vibration,
      running_veto_rate,
      running_time_week,
      running_other,
      working_condition,
      working_status,
      working_other,
      cool_temp,
      cool_heat,
      cool_flux,
      cool_water_level,
      cool_other,
      electrical_control_cabinet,
      electrical_vacuum_pump,
      electrical_chiller,
      error_record,
      other,
    },
  });
}
