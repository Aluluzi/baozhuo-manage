import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Modal} from 'antd';
import React, {useState, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ChinaArea from '@/components/ChinaArea'
import {getSalesmanList, saveSalesman, saveBindClinic, saveChgPassword, setStatus} from '@/services/userInformation';
import {connect} from "dva";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import style from './index.less'

const {confirm} = Modal;

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await saveSalesman(fields);
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
    await setStatus({
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
 * 绑定诊所
 * @param data
 */
const doBindClinic = async (data) => {
  const hide = message.loading('正在绑定');

  try {
    await saveBindClinic(data);
    hide();
    message.success('绑定成功');
    return true;
  } catch (error) {
    hide();
    message.error('绑定失败请重试！');
    return false;
  }
};
/**
 * 修改密码
 * @param data
 */
const doChgPassword = async (data) => {
  const hide = message.loading('正在修改');

  try {
    await saveChgPassword(data);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updataModalVisible, setUpdataModalVisible] = useState(false);
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
      title: '序号',
      width: 80,
      align: 'center',
      dataIndex: 'id',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record, index) => (
        <>
          {
            index + 1
          }
        </>
      ),
    },
    {
      title: '业务员信息',
      dataIndex: 'provinceId',
      align: 'center',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          {
            `${record.name}/${record.phone}`
          }
        </>
      ),
    },
    {
      title: '区域',
      dataIndex: 'provinceId',
      align: 'center',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          {
            `${record.provinceName}${record.cityName}${record.areaName}`
          }
        </>
      ),
    },
    {
      title: '诊所信息',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => {
        // let str = null
        // if (record.clinics) {
        //   record.clinics.forEach(item => {
        //     str += `<span>${item.id}/${item.name}</span>`
        //   })
        // } else {
        //   str = '--'
        // }
        return (
          <>
            {
              record.clinics.map((item) => (
                <div key={item.id}>{`${item.id}/${item.name}`}</div>
              ))
            }
          </>
        )
      },
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
            className='button-color-green'
            onClick={() => {
              setUpdataModalVisible(true)
              setStepFormValues({id: record.id, type: 'password'})
            }}
          >
            修改密码
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setUpdataModalVisible(true)
              setStepFormValues({id: record.id, type: 'clinic'})
            }}
          >
            绑定其他诊所
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
              roleType: '2',
              page: params.current,
              size: params.pageSize,
            }
          }
          // form.lastId =0 || params.current
          const res = await getSalesmanList(form)

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

              if (actionRef.current) {
                actionRef.current.reloadAndRest();
              }
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
          }}
          modalVisible={createModalVisible}
        />
      ) : null}
      {updataModalVisible ? (
        <UpdateForm
          onSubmit={async ({type, ...value}) => {
            const success = type === 'password' ? await doChgPassword(value) : await doBindClinic(value)

            if (success) {
              setUpdataModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setUpdataModalVisible(false);
          }}
          modalVisible={updataModalVisible}
          formValues={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
}

export default connect()(TableList);
