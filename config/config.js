// https://umijs.org/config/
import {defineConfig} from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const {REACT_APP_ENV} = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash', // 可选 browser、hash 和 memory
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user/login',
              name: 'login',
              component: './User/login',
            },
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/homePage',
            },
            {
              path: '/homePage',
              name: '首页',
              icon: 'home',
              component: './homePage',
            },
            {
              path: '/laboratory',
              name: '实验室相关',
              icon: 'shop',
              routes: [
                {
                  path: '/',
                  redirect: '/laboratory/list',
                },
                {
                  path: '/laboratory/list',
                  name: '实验室',
                  component: './Laboratory/List',
                },
                {
                  name: '耗材',
                  icon: 'smile',
                  path: '/laboratory/consumables',
                  component: './Laboratory/Consumables',
                },
                {
                  name: '项目分类',
                  icon: 'smile',
                  path: '/laboratory/projectClassify',
                  component: './Laboratory/ProjectClassify',
                },
              ],
            },
            {
              path: '/project',
              name: '项目',
              icon: 'shop',
              component: './Project',
            },
            {
              path: '/order',
              name: '订单',
              icon: 'shop',
              routes: [
                {
                  path: '/order/dayOrder',
                  name: '日结订单',
                  component: './Order/DayOrder',
                },
                {
                  hideInMenu: true,
                  path: '/order/dayOrder/details',
                  name: '订单详情',
                  component: './Order/Details',
                },
                {
                  hideInMenu: true,
                  path: '/order/monthOrder/details',
                  name: '订单详情',
                  component: './Order/Details',
                },
                {
                  name: '月结订单',
                  icon: 'smile',
                  path: '/order/monthOrder',
                  component: './Order/MonthOrder',
                },
              ],
            },
            {
              path: '/userInformation',
              name: '用户信息',
              icon: 'shop',
              routes: [
                {
                  path: '/',
                  redirect: '/userInformation/clinic',
                },
                {
                  path: '/userInformation/clinic',
                  name: '诊所信息',
                  component: './UserInformation/Clinic',
                },
                {
                  name: '医生账号',
                  icon: 'smile',
                  path: '/userInformation/doctor',
                  component: './UserInformation/Doctor',
                },
                {
                  name: '业务员账号',
                  icon: 'smile',
                  path: '/userInformation/salesman',
                  component: './UserInformation/Salesman',
                },
              ],
            },
            {
              path: '/settings',
              name: '系统设置',
              icon: 'shop',
              routes: [
                {
                  path: '/',
                  redirect: '/settings/setPassword',
                },
                {
                  path: '/settings/setPassword',
                  name: '修改密码',
                  component: './settings/SetPassword',
                }
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
