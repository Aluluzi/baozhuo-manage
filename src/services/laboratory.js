import request from '@/utils/request';

export async function getLabList(data) {
  return request('/api/lab/list', { method: 'post', data });
}
export async function saveLab(data) {
  return request('/api/lab/save', { method: 'post', data });
}
export async function setLabStatus(data) {
  return request('/api/lab/set-status', { method: 'post', data });
}
export async function getTubeList(data) {
  return request('/api/tube/list', { method: 'post', data });
}
export async function saveTube(data) {
  return request('/api/tube/save', { method: 'post', data });
}
export async function setTubeStatus(data) {
  return request('/api/tube/set-status', { method: 'post', data });
}
export async function getCategoryList(data) {
  return request('/api/category/list', { method: 'post', data });
}
export async function saveCategory(data) {
  return request('/api/category/save', { method: 'post', data });
}
export async function setCategoryStatus(data) {
  return request('/api/category/set-status', { method: 'post', data });
}
