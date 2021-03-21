import React from 'react';
import styles from './index.less';
import { Button, Table } from 'antd';
import style from '@/pages/UserInformation/Salesman/index.less';
// import {ExclamationCircleOutlined} from "@ant-design/icons";

// const {confirm} = Modal;
/*
0 - 已关闭

10 - 待付款

20 - 待审核

30 - 审核拒绝

40 - 待出报告

50 - 已取消

60 - 报告已出
* */
const dicStatus = {
  0: '已关闭',
  10: '待付款',
  20: '待审核',
  30: '审核拒绝',
  40: '待出报告',
  45: '部分报告已出',
  50: '已取消',
  60: '报告已出',
};

const CreateForm = (props) => {
  const { goDetails, pagination, data } = props;

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '实验室',
      align: 'center',
      dataIndex: 'labName',
    },
    {
      title: '订单时间',
      align: 'center',
      dataIndex: 'created',
    },
    {
      title: '订单状态',
      align: 'center',
      dataIndex: 'status',
      key: 'address',
      render: (_, record) => <>{dicStatus[record.status]}</>,
    },
    {
      title: '项目信息',
      dataIndex: 'name',
      align: 'center',
      render: (_, record) => (
        <>
          {record.orders
            ? record.orders
                .map((item) => {
                  return item.name;
                })
                .toString()
            : ''}
        </>
      ),
    },
    {
      title: '报告信息',
      align: 'center',
      dataIndex: 'reports',
      render: (_, record) => <>{record.reports.length > 0 ? '已出' : '未出'}</>,
    },
    {
      title: '订单金额',
      align: 'center',
      dataIndex: 'totalAmount',
      render: (_, record) => <>{record.totalAmount / 100}</>,
    },
    {
      title: '实际支付',
      dataIndex: 'payAmount',
      align: 'center',
      render: (_, record) => <>{record.payAmount / 100}</>,
    },
    {
      title: '区域',
      align: 'center',
      dataIndex: 'addressInfo',
      render: (_, record) => (
        <>
          {record.addressInfo
            ? `${record.addressInfo.provinceName}${record.addressInfo.cityName}${record.addressInfo.areaName}`
            : '--'}
        </>
      ),
    },
    {
      title: '诊所编号',
      align: 'center',
      dataIndex: 'clinicId',
    },
    {
      title: '诊所医生',
      align: 'center',
      dataIndex: 'doctorName',
    },
    {
      title: '业务员信息',
      align: 'center',
      dataIndex: 'salesmanName',
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      width: 240,
      valueType: 'option',
      render: (_, record) => (
        <>
          <div className={style.buttonGroup}>
            <Button
              type="primary"
              onClick={() => {
                goDetails(record);
              }}
            >
              查看信息
            </Button>
            {/* <Button */}
            {/*  type="primary" */}
            {/*  className='button-color-dust' */}
            {/*  onClick={() => { */}
            {/*    // console.log(record) */}
            {/*    confirm({ */}
            {/*      title: '提示', */}
            {/*      icon: <ExclamationCircleOutlined/>, */}
            {/*      content: '是否删除？', */}
            {/*      onOk() { */}
            {/*        handleDelete(record) */}
            {/*      }, */}
            {/*      onCancel() { */}
            {/*        console.log('Cancel'); */}
            {/*      }, */}
            {/*    }); */}
            {/*  }} */}
            {/* > */}
            {/*  删除 */}
            {/* </Button> */}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div id="components-table-demo-basic">
        <Table rowKey="id" pagination={pagination} columns={columns} dataSource={data} bordered />
      </div>
    </div>
  );
};
export default CreateForm;
