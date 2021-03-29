import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Modal, Select, Input} from 'antd';
import React, {useState, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import ChinaArea from '@/components/ChinaArea'
import {getClinicList, setSettleClinic, saveClinic, setStatusClinic, saveBindClinic} from '@/services/userInformation';
import {connect} from "dva";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import style from "@/pages/UserInformation/Salesman/index.less";
import UpdateForm from "./components/UpdateForm";

const {confirm} = Modal;
const {Option} = Select

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

/**
 * 修改结算方式
 * @param data
 */
const doChgPassword = async (data) => {
  console.log(data)
  const hide = message.loading('正在修改');
  try {
    await setSettleClinic(data);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

/**
 * 编辑
 * @param data
 */
const doBindClinic = async (data) => {
  const hide = message.loading('正在编辑');

  try {
    await saveClinic(data);
    hide();
    message.success('编辑成功');
    return true;
  } catch (error) {
    hide();
    message.error('编辑失败请重试！');
    return false;
  }
};


const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updataModalVisible, setUpdataModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [settleMethod, setSettleMethod] = useState(null);
  // const [clinicName, setClinicName] = useState(null);
  const actionRef = useRef();
  const queryParams = useRef({
    settleMethod: null,
    size: null,
    page: null,
    provinceId: null,
    cityId: null,
    areaId: null,
    name: null,
  });
  const columns = [
    {
      title: '类型',
      dataIndex: 'settleMethod',
      // colSize:2,
      hideInForm: true,
      hideInTable: true,
      renderFormItem: () => {
        function handleChange(data) {
          queryParams.current = {...queryParams.current, ...{settleMethod: data}}
          setSettleMethod(data)
          actionRef.current.reloadAndRest()
          // console.log(queryParams.current)
        }

        return (
          <Select value={settleMethod} style={{width: 120}} placeholder="诊所"
                  onChange={(v) => handleChange(v)}>
            <Option value={null}>全部</Option>
            <Option value={1}>日结</Option>
            <Option value={2}>月结</Option>
          </Select>
        )
      },
    },
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
      title: '诊所名字',
      align: 'center',
      dataIndex: 'name',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: () => {
        function handleChange(data) {
          queryParams.current = {...queryParams.current, ...{name: data}}
          // setClinicName(data)
          // actionRef.current.reloadAndRest()
          // console.log(queryParams.current)
        }

        return (
          <Input placeholder="请输入诊所名字"
                 onChange={(v) => handleChange(v.target.value)}/>
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
        <div className={style.buttonGroup}>
          <Button
            type="primary"
            className='button-color-purple'
            onClick={() => {
              setUpdataModalVisible(true)
              setStepFormValues({
                id: record.id,
                settleMethod: record.settleMethod,
                contactName: record.contactName,
                contactPhone: record.contactPhone,
                area: {
                  provinceId: record.provinceId,
                  cityId: record.cityId,
                  areaId: record.areaId
                },
                name: record.name,
                discount: record.discount,
                type: 'editor'
              })
            }}
          >
            编辑
          </Button>
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
      {updataModalVisible ? (
        <UpdateForm
          onSubmit={async ({type, ...value}) => {
            const success = type === 'password' ? await doChgPassword(value) : await doBindClinic(value)

            if (success) {
              setUpdataModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setUpdataModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={updataModalVisible}
          formValues={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
}

export default connect()(TableList);
