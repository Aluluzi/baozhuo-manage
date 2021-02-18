import request from '@/utils/request';

export async function getList(data) {
  return request('/api/lab/list', { method: 'post', data });
}
export async function saveInfo(data) {
  return request('/api/lab/save', { method: 'post', data });
}



