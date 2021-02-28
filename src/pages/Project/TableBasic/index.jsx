import React from 'react';
import styles from './index.less';
import {Button, Table} from 'antd';

const CreateForm = (props) => {
  const {toUpdate, data, pagination} = props
  // console.log(data)

  const columns = [
    {
      title: '项目编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '项目名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '项目明细',
      align: 'center',
      dataIndex: 'summary',
      render: (_, record) => {
        let str = null
        if (record.isCombo) {
          str = record.Items.map(item => {
            return item.name
          }).toString()
        } else {
          str = '无'
        }
        return (
          <>
            {str}
          </>
        )
      },
    },
    {
      title: '样本要求',
      align: 'center',
      dataIndex: 'sampleRequire',
    },
    {
      title: '耗材id',
      dataIndex: 'tubeId',
      align: 'center',
      render: (_, record) => {
        let str = null
        if (record.Tubes) {
          str = record.Tubes.map(item => {
            return `${item.id}(${item.name})`
          }).toString()
        } else {
          str = ''
        }
        return (
          <>
            {str}
          </>
        )
      },
    },
    {
      title: '项目代号',
      align: 'center',
      dataIndex: 'code',
      render: (_, record) => {
        let str = null
        if (record.isCombo) {
          str = record.Items.map(item => {
            return item.code
          }).toString()
        } else {
          str = record.code
        }
        return (
          <>
            {str}
          </>
        )
      },
    },
    {
      title: '报告时间',
      align: 'center',
      dataIndex: 'reportTime',
    },
    {
      title: '收费标准',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '临床应用',
      dataIndex: 'clinicalApply',
      align: 'center',
    },
    {
      title: '保存条件',
      align: 'center',
      dataIndex: 'storageCondition',
    },
    {
      title: '检测方法',
      align: 'center',
      dataIndex: 'inspectionMethod',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              toUpdate(record)
            }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div id="components-table-demo-basic">
        <Table columns={columns} rowKey="id" dataSource={data} pagination={pagination} bordered/>
      </div>
    </div>
  )
}
export default CreateForm
