import fetch from 'dva/fetch';
import { getUserInfo } from '@/services/user';
import { ajaxPrefix } from './request';

export const request = (url, options) => {
  let defaultOptions = {
    credentials: 'same-origin',
    mode: 'cors',
    ...options,
  };

  const userInfo = getUserInfo();

  defaultOptions.params.token = userInfo.token;

  let paramsArray = [];
  //拼接参数
  Object.keys(defaultOptions.params).forEach(key =>
    paramsArray.push(key + '=' + defaultOptions.params[key])
  );
  if (url.search(/\?/) === -1) {
    url += '?' + paramsArray.join('&');
  } else {
    url += '&' + paramsArray.join('&');
  }

  return fetch(`${ajaxPrefix}${url}`, defaultOptions).then(res => res.blob());
};

export default request;
