/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
// import { getUserInfo } from '@/services/user';
import {useHistory} from "react-router-dom";
// import router from 'umi/router';
import configs from '../../config/env';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  const router = useHistory()

  if (status === 302) {
    notification.error({
      message: '未登录或登录已过期，请重新登录。',
    });
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
};

export const ajaxPrefix = 'https://www.baozhuoyl.com';
// export const ajaxPrefix = 'http://testmedicine.yunhuyj.com';
// console.log(configs[process.env.API_ENV])
// export const ajaxPrefix = configs[process.env.API_ENV].API_SERVER;

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'same-origin',
  mode: 'cors',
});

request.interceptors.request.use((url, options) => {
  // const userInfo = getUserInfo();
  const userInfo = {token:'13'};

  if (userInfo) {
    if (options.method === 'upload') {
      options.method = 'post';
    } else {
      const type = options.method === 'get' ? 'params' : 'data';
      options = {
        ...options,
        [type]: {
          ...options[type],
          // salt: userInfo.salt,
          token: userInfo.token,
        },
      };
    }
  }
  return {
    url: url.indexOf('dio') > 0 ? url : `${ajaxPrefix}${url}`,
    // url: `${ajaxPrefix}${url}`,
    options,
  };
});

request.interceptors.response.use(async response => {
  const res = await response.clone().json();
  // res.msg === '用户未登录' && router.push('/user/login');
  res.code === 302 && router.push('/user/login');
  res.code !== 200 && message.error(res.msg);
  return response;
});

export default request;
