import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Image } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { getTubeList, saveTube, setTubeStatus, delTube } from '@/services/laboratory';
import { connect } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ajaxPrefix } from '@/utils/request';
import style from '@/pages/UserInformation/Salesman/index.less';

const { confirm } = Modal;

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await saveTube(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (data, actionRef) => {
  const hide = message.loading('正在配置');

  try {
    await setTubeStatus({
      id: data.id,
      status: data.status === 0 ? 1 : 0,
    });
    hide();
    message.success('配置成功');
    actionRef.current.reload();
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除
 * @param fields
 */

const handleDel = async (data, actionRef) => {
  const hide = message.loading('正在删除');

  try {
    await delTube({
      id: data.id,
    });
    hide();
    message.success('删除成功');
    actionRef.current.reload();
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const queryParams = useRef({
    size: null,
    page: null,
    status: '1',
  });
  const columns = [
    {
      title: '耗材id',
      width: 80,
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '耗材类型',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '图片',
      align: 'center',
      dataIndex: 'img',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          <Image width={40} src={`${ajaxPrefix}/file/${record.img}`} />
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      valueType: 'option',
      render: (_, record) => (
        <div className={style.buttonGroup}>
          <Button
            type="primary"
            className="button-color-sunset"
            onClick={() => {
              // console.log(record)
              confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '是否删除？',
                onOk() {
                  handleDel(record, actionRef);
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            删除
          </Button>
          <Button
            type="primary"
            className={record.status === 0 ? '' : 'button-color-dust'}
            onClick={() => {
              // console.log(record)
              confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: record.status === 0 ? '是否启用？' : '是否停用？',
                onOk() {
                  handleUpdate(record, actionRef);
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            {record.status === 0 ? '启用' : '停用'}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        search={{
          labelWidth: 120,
          optionRender: ({ searchText }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                if (actionRef.current) {
                  actionRef.current.reloadAndRest();
                }
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="ghost"
              type="primary"
              className="button-color-green"
              onClick={() => handleModalVisible(true)}
            >
              <PlusOutlined /> 新建
            </Button>,
          ],
        }}
        toolBarRender={false}
        request={async (params) => {
          const form = {
            ...queryParams.current,
            ...{
              page: params.current,
              size: params.pageSize,
            },
          };
          // form.lastId =0 || params.current
          const res = await getTubeList(form);

          return {
            data: res.data.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: res.data.total,
          };
        }}
        columns={columns}
      />
      {createModalVisible ? (
        <CreateForm
          onSubmit={async (value) => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reloadAndRest();
              }
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={createModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
};

export default connect()(TableList);
