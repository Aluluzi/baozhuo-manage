import React, {useState, useEffect, useCallback} from 'react';
import {connect} from 'dva';
import {Row, Col} from 'antd';
import {getTodayStatistic} from "@/services/global";

const style = {
  baseModule: {
    background: '#fff', padding: '8px 0', textAlign: 'center'
  }
};

const HookProps = () => {
  const [list, setList] = useState({
    num: 0,
    payAmount: 0,
    totalAmount: 0,
  })
  // 获取实验室列表
  const getLab = useCallback(
    async () => {
      try {
        const res = await getTodayStatistic();
        setList(res.data)
      } catch (e) {
        console.log(e)
      }
    }, []
  )

  useEffect(() => {
    getLab();
  }, [getLab]);
  return (
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
  );
};

export default connect()(HookProps);
