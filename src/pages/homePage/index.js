import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

const style = { background: '#fff', padding: '8px 0' , textAlign:'center'};

const HookProps = props => {
  return (
    <>
      <Row gutter={16}>
        <Col  span={6}>
          <div style={style}>
            <p>今日订单总数</p>
            <p>200</p>
          </div>
        </Col>
        <Col  span={6}>
          <div style={style}>
            <p>今日订单总额</p>
            <p>￥200</p>
          </div>
        </Col>
        <Col  span={6}>
          <div style={style}>
            <p>今日实际收入</p>
            <p>￥200</p>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default connect()(HookProps)
