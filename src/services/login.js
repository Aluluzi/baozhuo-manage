import request from '@/utils/request';
// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }
// export async function getFakeCaptcha(mobile) {
//   return request(`/api/login/captcha?mobile=${mobile}`);
// }

export async function login(data) {
  return request('/api/login', {
    method: 'post',
    data
  });
}
export function chgMyPassword(data) {
  return request('/api/chg-my-password', {
    method: 'post',
    data
  });
}
