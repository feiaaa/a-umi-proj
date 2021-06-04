import request from '@/utils/request';

export async function query(params) {
  return request('/home/list', {
    params,
  });
}

