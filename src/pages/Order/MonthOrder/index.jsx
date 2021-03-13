import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Card, Radio, Row, Col, Input, DatePicker } from 'antd';
import styles from './index.less';
import TableBasic from './TableBasic';
import { exportTrade, getOrderList } from '@/services/order';
import { PageContainer } from '@ant-design/pro-layout';
import StandardFormRow from '@/components/StandardFormRow';
import { history } from 'umi';
import moment from 'moment';
import useEventListener from '@use-it/event-listener';
import { ajaxPrefix } from '@/utils/request';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const colLayout = {
  span: 8,
};

const format = 'YYYY-MM-DD HH';

const Order = () => {
  const params = useRef({
    size: 10,
    page: 1,
    status: '',
  });
  const [status, setStatus] = useState('');

  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const queryParameter = useRef({
    labId: null,
    salesmanKey: '',
    tradeId: null,
    clinicKey: '',
  });

  // 获取列表
  const getList = useCallback(async () => {
    // console.log(form.getFieldsValue(true))
    const { tradeId, ...d } = form.getFieldsValue(true);
    const data = {
      ...params.current,
      ...d,
      ...{ settleMethod: '2', tradeId: tradeId ? Number(tradeId) : null },
    };
    // eslint-disable-next-line prefer-const
    let { time, ...obj } = data;
    console.log(data);
    if (time) {
      obj = {
        ...obj,
        ...{
          createdFrom: time ? time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
          createdEnd: time ? time[1].format('YYYY-MM-DD HH:mm:ss') : '',
        },
      };
    }
    try {
      const res = await getOrderList(obj);
      // console.log(res)
      setList(res.data.data || []);
      // eslint-disable-next-line no-use-before-define
      setPagination((e) => {
        return { ...e, ...{ total: res.data.total } };
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  function handleOk() {
    getList();
  }

  // 获取实验室列表
  // const getLab = useCallback(
  //   async () => {
  //     try {
  //       const res = await getLabList({size: 100, page: 1});
  //       // console.log(res)
  //       const id = res.data.data ? res.data.data[0].id : null
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }, []
  // )

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: null,
    showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条`,
    showSizeChanger: true,
    onChange: (page, pageSize) => {
      // console.log(page, pageSize)
      setPagination((e) => {
        return { ...e, ...{ current: e.pageSize !== pageSize ? 1 : page, pageSize } };
      });
      setTimeout(() => {
        getList();
      });
    },
  });

  function disabledDate(current) {
    return current > moment();
  }

  /**
   * 导出
   */

  async function doExport() {
    const { tradeId, ...d } = form.getFieldsValue(true);
    const data = {
      ...params.current,
      ...d,
      ...{ settleMethod: '2', tradeId: tradeId ? Number(tradeId) : null },
    };
    // eslint-disable-next-line prefer-const
    let { time, ...obj } = data;
    // console.log(data)
    if (time) {
      obj = {
        ...obj,
        ...{
          createdFrom: time ? time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
          createdEnd: time ? time[1].format('YYYY-MM-DD HH:mm:ss') : '',
        },
      };
    }
    try {
      const res = await exportTrade({
        ...obj,
        ...{
          size: 99999,
          page: 1,
        },
      });
      // console.log(res);
      window.open(`${ajaxPrefix}/file/${res.data}`);
    } catch (e) {
      console.log(e);
    }
  }

  useEventListener('keydown', ({ keyCode }) => {
    if (keyCode === 13) {
      getList();
    }
  });

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    // console.log(status)
    params.current = {
      page: pagination.current,
      size: pagination.pageSize,
      status,
    };
  }, [pagination, status]);

  return (
    <PageContainer className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          initialValues={queryParameter.current}
          name="dayOrder"
          form={form}
          {...formItemLayout}
        >
          <StandardFormRow block>
            <FormItem noStyle>
              <FormItem noStyle>
                <RadioGroup
                  defaultValue={status}
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setTimeout(() => getList(), 0);
                  }}
                  buttonStyle="solid"
                >
                  <RadioButton value="">全部订单</RadioButton>
                  <RadioButton value="10">待付款</RadioButton>
                  <RadioButton value="20">未审核</RadioButton>
                  <RadioButton value="40">报告未出</RadioButton>
                  <RadioButton value="45">部分报告已出</RadioButton>
                  <RadioButton value="60">报告已出</RadioButton>
                  <RadioButton value="50">已取消</RadioButton>
                </RadioGroup>
                <div style={{ display: 'inline-block', float: 'right' }}>
                  <Button type="primary" style={{ marginRight: 16 }} onClick={handleOk}>
                    查询
                  </Button>
                  <Button className="button-color-green" type="primary" onClick={() => doExport()}>
                    批量导出
                  </Button>
                </div>
              </FormItem>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow style={{ paddingBottom: 0 }} grid last>
            <FormItem noStyle>
              <Row gutter={16}>
                <Col {...colLayout}>
                  <FormItem name="clinicKey" label="诊所搜索">
                    <Input placeholder="编号/名称/医生姓名/手机号" />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem name="salesmanKey" label="业务员">
                    <Input placeholder="业务员姓名/手机号" />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem name="tradeId" label="订单搜索">
                    <Input placeholder="订单编号" />
                  </FormItem>
                </Col>
                <Col {...colLayout} style={{ paddingLeft: 20 }}>
                  <FormItem name="patientKey" label="患者">
                    <Input placeholder="患者姓名/手机号" />
                  </FormItem>
                </Col>
                <Col {...colLayout} style={{ paddingLeft: 21 }}>
                  <FormItem name="labName" label="实验室">
                    <Input placeholder="实验室" />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <FormItem name="time" label="订单时间">
                    <RangePicker
                      disabledDate={disabledDate}
                      format={format}
                      placeholder={['开始时间', '结束时间']}
                    />
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
          </StandardFormRow>
        </Form>
      </Card>
      <Card style={{ marginTop: 24 }}>
        <TableBasic
          goDetails={(v) =>
            history.push({
              pathname: '/order/monthOrder/details',
              query: {
                id: v.id,
              },
            })
          }
          data={list}
          pagination={pagination}
        />
      </Card>
    </PageContainer>
  );
};

export default Order;
