import request from "@/utils/request";

export async function getProvinces(data) {
  return request('/api/address/provinces', { method: 'post', data });
}
export async function getCities(data) {
  return request('/api/address/cities', { method: 'post', data });
}
export async function getAreas(data) {
  return request('/api/address/areas', { method: 'post', data });
}
