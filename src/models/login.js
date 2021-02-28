import {stringify} from 'querystring';
import {history} from 'umi';
import {login} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';
import {routerRedux} from 'dva/router';
// import { message } from 'antd';
// import {initAuthority} from "../../../../drugmall-manage/src/utils/authority";
import {setUserInfo, setToken, removeUserInfo, removeToken} from '@/services/user';
// import {reloadAuthorized} from "../../../../drugmall-manage/src/utils/Authorized";
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({payload}, {call, put}) {
      try {
        const res = yield call(login, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: res.data,
        }); // Login successfully
        if (res.code === 200) {
          setUserInfo(res.data);
          setToken(res.data.token)
          yield put(routerRedux.replace('/'));
        }
      } catch (e) {
        console.log(e)
      }

      // if (response.status === 'ok') {
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   message.success('🎉 🎉 🎉  登录成功！');
      //   let { redirect } = params;
      //
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //
      //       if (redirect.match(/^\/.*#/)) {
      //         redirect = redirect.substr(redirect.indexOf('#') + 1);
      //       }
      //     } else {
      //       window.location.href = '/';
      //       return;
      //     }
      //   }
      //
      //   history.replace(redirect || '/');
      // }
    },

    logout() {
      const {redirect} = getPageQuery(); // Note: There may be security issues, please note

      removeUserInfo()
      removeToken()
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      setAuthority(payload.currentAuthority);
      return {...state, status: payload.status, type: payload.type};
    },
  },
};
export default Model;
