// 表单常用的layout
export const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

// label长的layout
export const formLayoutShort = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

// label长的layout
export const formLayoutLong = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// 初始化带分页的回调数据
export const initResList = (res, name) => {
  const {
    pagination: { total, page_no, page_size },
    data = [],
  } = res;
  return {
    type: 'queryData',
    payload: {
      name,
      data: {
        list: data,
        pagination: {
          current: page_no,
          pageSize: page_size,
          total,
        },
      },
    },
  };
};
