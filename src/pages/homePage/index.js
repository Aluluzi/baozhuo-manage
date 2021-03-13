import React, {useState, useEffect, useCallback} from 'react';
import {connect} from 'dva';
import {Row, Col, DatePicker, Descriptions, Card} from 'antd';
import {getTodayStatistic} from "@/services/global";

const {RangePicker} = DatePicker;
const style = {
  baseModule: {
    background: '#fff', padding: '8px 0', textAlign: 'center'
  }
};
const format = 'YYYY-MM-DD';

const HookProps = () => {
  const [list, setList] = useState({
    num: 0,
    payAmount: 0,
    totalAmount: 0,
  })

  const [statistical, setStatistical] = useState({
    num: null,
    payAmount: null,
    totalAmount: null,
  })
  // 统计
  const getLab = useCallback(
    async (v) => {
      const obj = v ? {
        startDate: v ? v[0].startOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: v ? v[1].endOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
      } : {}
      try {
        const res = await getTodayStatistic(obj);
        if (v) {
          setStatistical(res.data)
        } else {
          setList(res.data)
        }
      } catch (e) {
        console.log(e)
      }
    }, []
  )

  function disabledDate(current) {
    return current > new Date();
  }

  // 时间变化
  function handleChange(e) {
    getLab(e)
  }

  useEffect(() => {
    getLab();
  }, [getLab]);
  return (
    <>
      <Row gutter={16} justify='center'>
        <Col span={6}>
          <div style={style.baseModule}>
            <p>今日订单总数</p>
            <p>{list.num}</p>
          </div>
        </Col>
        <Col span={6}>
          <div style={style.baseModule}>
            <p>今日订单总额</p>
            <p>￥{list.totalAmount / 100}</p>
          </div>
        </Col>
        <Col span={6}>
          <div style={style.baseModule}>
            <p>今日实际收入</p>
            <p>￥{list.payAmount / 100}</p>
          </div>
        </Col>
      </Row>
      <Card style={{marginTop: 20}}>
        <RangePicker
          disabledDate={disabledDate}
          format={format}
          placeholder={['开始时间', '结束时间']}
          onChange={handleChange}
          allowClear={false}
        />
        <Descriptions title="订单数据统计" style={{marginTop: 20}}>
          <Descriptions.Item label="订单总数">{statistical.num}</Descriptions.Item>
          <Descriptions.Item
            label="订单总额">{statistical.totalAmount ? statistical.totalAmount / 100 : null}</Descriptions.Item>
          <Descriptions.Item
            label="实际收入">{statistical.payAmount ? statistical.payAmount / 100 : null}</Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default connect()(HookProps);
