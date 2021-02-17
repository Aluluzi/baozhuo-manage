import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {Button,Table,Switch } from 'antd'
// import EditInfo from './components/EditInfo'
// import CreateLink from './components/CreateLink'
// import SearchInfo from './components/SearchInfo'

const HookProps = props => {

  const [page, setPage] = useState(1),
    [visible, setVisible] = useState(''),
    [info, setInfo] = useState({}),
    [searchContent, setSearchContent] = useState({}),
    { dispatch, list, pagination } = props;

  useEffect(() => {
    loadList();
  },[page,searchContent]);

  const loadList = () => {
    dispatch({
      type: 'message/List',
      payload: {
        pagination:{
          page_no: page,
          page_size: 10,
        },
        conditions:searchContent
      },
    });
  };
  const initPagination = info => ({
    current: info.current,
    pageSize: info.pageSize,
    total: info.total,
    showQuickJumper: false,
    showSizeChanger: false,
    showTotal: () => `共：${info.total} 条`,
    onChange: page => setPage(page),
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, _, index) => index + 1,
    },
    {
      title: '编号',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '区域',
      dataIndex: 'content',
    },
    {
      title: '检验所',
      dataIndex: 'redirect_url',
    },
    {
      title: '操作',
      dataIndex: 'control',
      align: 'center',
      width: 150,
      render: () => (
        <>
          <Switch defaultChecked />
        </>
      )
    },
  ];
  return (
    <>
      {/*<SearchInfo onSearch={(values)=>setSearchContent(values)}/>*/}
      <Button type="primary" style={{marginBottom:'15px'}} onClick={() => {
        setInfo({})
        setVisible('edit')
      }}>新增实验室</Button>

      <Table
        size="middle"
        dataSource={list}
        columns={columns}
        childrenColumnName="child"
        pagination={initPagination(pagination)}
        rowKey={i => 'laboratotyItem-'+i.id}
      />
      {/*<EditInfo visible={visible==='edit'} onClose={closeModal} info={info} />*/}
      {/*<CreateLink visible={visible==='link'} onClose={closeModal} info={info} />*/}
    </>
  );
}

export default connect(({ laboratoty}) => ({
  list:laboratoty.laboratotyInfo.list,
  pagination:laboratoty.laboratotyInfo.pagination,
}))(HookProps);
