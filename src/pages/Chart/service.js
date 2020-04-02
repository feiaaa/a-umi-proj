import request from '@/utils/request';

export async function queryEcharts(params) {
  return request('/api/chart', {
    params,
  });
}

