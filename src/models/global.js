import { getProvinces, getCities, getAreas } from '@/services/global';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
  },
  effects: {
    *getProvinces({ payload, callback }, { call }) {
      const res = yield call(getProvinces, payload);
      if (res.code === 200) {
        callback(res);
        // message.success('操作成功');
      }
    },
    *getCities({ payload, callback }, { call }) {
      const res = yield call(getCities, payload);
      if (res.code === 200) {
        callback(res);
        // message.success('操作成功');
      }
    },
    *getAreas({ payload, callback }, { call }) {
      const res = yield call(getAreas, payload);
      if (res.code === 200) {
        callback(res);
        // message.success('操作成功');
      }
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item) => item.type !== payload),
      };
    },
  },
};
export default GlobalModel;
