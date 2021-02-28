import request from '@/utils/request';

export async function getOrderList(data) {
  return request('/api/trade/list', { method: 'post', data });
}
export async function saveLab(data) {
  return request('/api/lab/save', { method: 'post', data });
}
export async function getOrderDetails(id) {
  return request(`/api/trade/${id}`, { method: 'post' });
}
export async function saveTube(data) {
  return request('/api/tube/save', { method: 'post', data });
}
export async function getCategoryList(data) {
  return request('/api/category/list', { method: 'post', data });
}
export async function saveInspection(data) {
  return request('/api/inspection-item/save', { method: 'post', data });
}
