import axios from 'axios';
import request from '@/utils/request';

const baseURL = 'http://47.115.49.59:8000/api';

export function login({ username, password }) {
    return request({
        method: 'post',
        url: '/login/',
        data: {
            username,
            password
        }
    })
}