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

// 保存token
export const setToken = (data) => {
  window.localStorage.setItem('token', data);
};

// 获取token
export const getToken = () => {
  return window.localStorage.getItem('token');
};

// 获取token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// 保存用户信息
export const setUserInfo = (info) => {
  localStorage.setItem('baozhuo-manage-userInfo', JSON.stringify(info));
};

// 删除用户信息
export const removeUserInfo = () => {
  localStorage.removeItem('baozhuo-manage-userInfo');
};

// 获取用户信息
export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem('baozhuo-manage-userInfo'));
};
