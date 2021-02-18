import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
// 保存用户信息
export const setUserInfo = info => {
  sessionStorage.setItem('baozhuo-manage-userInfo', JSON.stringify(info));
};

// 删除用户信息
export const removeUserInfo = () => {
  sessionStorage.removeItem('baozhuo-manage-userInfo');
};

// 获取用户信息
export const getUserInfo = () => {
  return JSON.parse(sessionStorage.getItem('baozhuo-manage-userInfo'));
};
