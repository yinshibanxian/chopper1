import request from "@/utils/request";


export function getDetailData({ start_time, end_time, chopper_code }) {
    return request({
        url: '/data/list_chopper_standard/',
        method: 'get',
        params: {
            start_time,
            end_time,
            chopper_code
        }
    })
}