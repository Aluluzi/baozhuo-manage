import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Modal} from 'antd';
import React, {useState, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import ChinaArea from '@/components/ChinaArea'
import {getClinicList, saveClinic, setStatusClinic} from '@/services/userInformation';
import {connect} from "dva";
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {confirm} = Modal;

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await saveClinic(fields);
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
    await setStatusClinic({
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

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const queryParams = useRef({
    // status:1,
    size: null,
    page: null,
    provinceId: null,
    cityId: null,
    areaId: null
  });
  const columns = [
    {
      title: '区域',
      dataIndex: 'updatedAt',
      colSize: 2,
      hideInForm: true,
      hideInTable: true,
      renderFormItem: () => {
        function handleChange(data) {
          queryParams.current = {...queryParams.current, ...data}
        }

        return (
          <ChinaArea onChange={handleChange}/>
        )
      },
    },
    {
      title: '编号',
      width: 80,
      align: 'center',
      dataIndex: 'id',
      hideInSearch: true,
      hideInForm: true
    },
    {
      title: '区域',
      dataIndex: 'addressInfo',
      align: 'center',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          {
            `${record.addressInfo.provinceName}${record.addressInfo.cityName}${record.addressInfo.areaName}`
          }
        </>
      ),
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'settleMethod',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          {
            record.settleMethod === 1 ? '日结' : '月结'
          }
        </>
      ),
    },
    {
      title: '诊所',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
      hideInForm: true
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
            className={record.status === 0 ? '' : 'button-color-dust'}
            onClick={() => {
              // console.log(record)
              confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined/>,
                content: record.status === 0 ? '是否启用？' : '是否停用？',
                onOk() {
                  handleUpdate(record, actionRef)
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            {record.status === 0 ? '启用' : '停用'}
          </Button>
        </>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        bordered
        pagination={{pageSize: 10}}
        search={{
          labelWidth: 120,
          optionRender: ({searchText}) => [
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
              <PlusOutlined/> 新建
            </Button>
          ],
        }}
        toolBarRender={false}
        request={async (params) => {
          const form = {
            ...queryParams.current,
            ...{
              page: params.current,
              size: params.pageSize,
            }
          }
          // form.lastId =0 || params.current
          const res = await getClinicList(form)

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
}

export default connect()(TableList);
