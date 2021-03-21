import request from '@/utils/request';

export async function getOrderList(data) {
  return request('/api/trade/list', { method: 'post', data });
}
export async function setBarcode(data) {
  return request('/api/trade/set-barcode', { method: 'post', data });
}
export async function closeOrder(data) {
  return request('/api/trade/close', { method: 'post', data });
}
export async function saveLab(data) {
  return request('/api/lab/save', { method: 'post', data });
}
export async function getOrderDetails(id) {
  return request(`/api/trade/${id}`, { method: 'post' });
}

export async function exportTrade(data) {
  return request('/api/trade/export', { method: 'post', data });
}
