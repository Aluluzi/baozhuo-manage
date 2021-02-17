import { message } from 'antd';
import {
  getList,
  saveInfo,
} from '@/services/laboratory';
import { initResList } from '@/utils/initial';

export default {
  namespace: 'laboratory',

  state: {
    laboratoryInfo: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    // 读取module列表
    *List({ payload }, { call, put }) {
      const res = yield call(getList, payload);
      if (res.code === 200) {
        yield put(initResList(res, 'messageInfo'));
      }
    },

    // 新增
    *Add({ payload, callback }, { call, put }) {
      const res = yield call(addMessage, payload);
      if (res.code === 0) {
        callback && callback();
        message.success('操作成功');
      }
    },
    // 编辑
    *Search({ payload, callback }, { call, put }) {
      const res = yield call(searchMessage, payload);
      if (res.code === 0) {
        message.success('操作成功');
        callback && callback();
      }
    },
    // 删除
    *Delete({ payload,callback }, { call, put }) {
      const res = yield call(deleteMessage, payload);
      if (res.code === 0) {
        message.success('删除成功');
        callback();
      }
    },
  },
  reducers: {
    // 更新列表
    queryData(state, { payload }) {
      return {
        ...state,
        [payload.name]: payload.data,
      };
    },
  },
};
