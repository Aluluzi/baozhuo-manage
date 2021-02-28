import request from '@/utils/request';

export async function getClinicList(data) {
  return request('/api/clinic/list', { method: 'post', data });
}
export async function saveClinic(data) {
  return request('/api/clinic/save', { method: 'post', data });
}
export async function setStatusClinic(data) {
  return request('/api/clinic/set-status', { method: 'post', data });
}
export async function getDoctorList(data) {
  return request('/api/doctor/list', { method: 'post', data });
}
export async function saveDoctor(data) {
  return request('/api/user/save', { method: 'post', data });
}
export async function getSalesmanList(data) {
  return request('/api/user/list', { method: 'post', data });
}
export async function saveSalesman(data) {
  return request('/api/user/save', { method: 'post', data });
}
export async function saveBindClinic(data) {
  return request('/api/user/bind-clinic', { method: 'post', data });
}
export async function saveChgPassword(data) {
  return request('/api/user/chg-password', { method: 'post', data });
}
export async function setStatus(data) {
  return request('/api/user/set-status', { method: 'post', data });
}