import {Button, Card, Col, Descriptions, Divider, Row} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import styles from './style.less';
import {getOrderDetails} from "@/services/order";
import {history} from 'umi'
import {ajaxPrefix} from "@/utils/request";

const dicSex = {
  M: '男',
  F: '女'
}
const dicStatus = {
  '0': '已关闭',
  '10': '待付款',
  '20': '待审核',
  '30': '审核拒绝',
  '40': '待出报告',
  '50': '已取消',
  '60': '报告已出',
}

function Details() {
  const [list, setList] = useState({})
  // 获取列表
  const getList = useCallback(async (id) => {
      // console.log(params.current)
      try {
        const res = await getOrderDetails(id);
        // console.log(res)
        setList(res.data || [])
      } catch (e) {
        console.log(e)
      }
    }, []
  )

  function expectFile(url) {
    if (url) {
      window.open(`${ajaxPrefix}/file/${url}`)
    }
  }

  useEffect(() => {
    const {id} = history.location.query
    getList(id);
  }, [getList]);

  return (
    <PageContainer onBack={() => history.goBack()}>
      <Card bordered={false} style={{
        marginBottom: 32,
      }}>
        <Row>
          <Col sm={8} xs={24}>
              <span>
                当前订单状态：报告已出
              </span>
            <Button type="primary" className={styles.but1}>查看</Button>
            <Button type="primary" className="button-color-green"
                    onClick={() => expectFile(list.reportUrl)}>导出报告</Button>
          </Col>
        </Row>
      </Card>
      <Card bordered={false}>
        <Descriptions
          title="基本信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="订单编号">{list.id}</Descriptions.Item>
          <Descriptions.Item label="订单状态">{dicStatus[list.status]}</Descriptions.Item>
          <Descriptions.Item label="订单时间">{list.created}</Descriptions.Item>
          <Descriptions.Item label="区域">
            {
              list.addressInfo ? `${list.addressInfo.provinceName}${list.addressInfo.cityName}${list.addressInfo.areaName}` : '--'
            }
          </Descriptions.Item>
          <Descriptions.Item label="采样时间">{list.samplingTime}</Descriptions.Item>
          <Descriptions.Item label="业务员信息">{list.salesmanName}</Descriptions.Item>
          <Descriptions.Item
            label="病人信息">{list.patient ? `${list.patient.name}/${dicSex[list.patient.sex]}/${list.patient.age}/${list.patient.phone}` : ''}</Descriptions.Item>
          <Descriptions.Item label="项目信息">
            {
              list.orders ? list.orders.map(item => {
                return item.name
              }).toString() : ''
            }
          </Descriptions.Item>
          <Descriptions.Item label="耗材">
            {
              list.tubes ? list.tubes.map(item => {
                return item.tubeName
              }).toString() : ''
            }
          </Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <Descriptions
          title="诊所信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="诊所编号">{list.clinicId}</Descriptions.Item>
          <Descriptions.Item label="诊所医生">{list.doctorName}</Descriptions.Item>
          <Descriptions.Item label="诊所类型">{list.settleMethod === 1 ? '日结' : '月结'}</Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <Descriptions
          title="金额信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="订单金额（元）">{list.totalAmount / 100}</Descriptions.Item>
          <Descriptions.Item label="实际支付（元）">{list.payAmount / 100}</Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
}

export default Details