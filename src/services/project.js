import request from '@/utils/request';

export async function getInspectionList(data) {
  return request('/api/inspection-item/list', { method: 'post', data });
}
export async function saveLab(data) {
  return request('/api/lab/save', { method: 'post', data });
}
export async function getTubeList(data) {
  return request('/api/tube/list', { method: 'post', data });
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
export async function exportInspection(data) {
  return request('/api/inspection-item/export', { method: 'post', data });
}
