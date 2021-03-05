import {PlusOutlined} from '@ant-design/icons';
import {Button, Input, message, Modal, Select} from 'antd';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {getClinicList, getDoctorList, saveChgPassword, saveDoctor, setDoctorStatus} from '@/services/userInformation';
import {connect} from "dva";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import style from "@/pages/UserInformation/Salesman/index.less";
import ChinaArea from "@/components/ChinaArea";

const {confirm} = Modal;
const {Option} = Select

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await saveDoctor(fields);
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
    await setDoctorStatus({
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
  const [stepFormValues, setStepFormValues] = useState({});
  const [updataModalVisible, setUpdataModalVisible] = useState(false);
  const [currentLab, setCurrentLab] = useState(null)
  // const [name, setName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [labList, setLab] = useState([])
  const actionRef = useRef();
  const queryParams = useRef({
    name: null,
    phone: null,
    size: null,
    page: null,
    provinceId: null,
    cityId: null,
    areaId: null
  });

  // 获取实验室列表
  const getLab = useCallback(
    async () => {
      try {
        // queryParams.current = {...queryParams.current, ...{clinicId: 1}}
        const res = await getClinicList({size: 100, page: 1});
        const id = res.data.data ? res.data.data[0].id : null
        queryParams.current = {...queryParams.current, ...{clinicId: id}}
        setLab(res.data.data || [])
        setCurrentLab(id)
        setTimeout(() => {
          actionRef.current.reload();
        })
      } catch (e) {
        console.log(e)
      }
    }, []
  )

  useEffect(() => {
    getLab();
  }, [getLab]);

  const columns = [
    {
      title: '诊所',
      dataIndex: 'clinicId',
      // colSize:2,
      hideInForm: true,
      hideInTable: true,
      renderFormItem: () => {
        function handleChange(data) {
          queryParams.current = {...queryParams.current, ...{clinicId: data}}
          setCurrentLab(data)
          actionRef.current.reloadAndRest()
          // console.log(queryParams.current)
        }

        return (
          <Select value={currentLab} style={{width: 120}} placeholder="诊所"
                  onChange={(v) => handleChange(v)}>
            {
              labList.map((item) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))
            }
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
      title: '医生姓名',
      align: 'center',
      dataIndex: 'name',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: () => {
        function handleChange(data) {
          queryParams.current = {...queryParams.current, ...{name: data}}
          // setName(data)
          // actionRef.current.reloadAndRest()
          // console.log(queryParams.current)
        }

        return (
          <Input placeholder="请输入医生姓名"
                 onChange={(v) => handleChange(v.target.value)}/>
        )
      },
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'phone',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: () => {
        function handleChange(data) {
          queryParams.current = {...queryParams.current, ...{phone: data}}
          setPhone(data)
          // actionRef.current.reloadAndRest()
          // console.log(queryParams.current)
        }

        return (
          <Input value={phone} placeholder="请输入手机号码"
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
      title: '类型',
      align: 'center',
      dataIndex: 'roleType',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          {
            `${record.roleType === 3 ? '诊所' : '医生'}`
          }
        </>
      ),
    },
    {
      title: '诊所编号',
      align: 'center',
      dataIndex: 'clinic',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          {
            `${record.clinic.id}`
          }
        </>
      ),
    },
    {
      title: '诊所名字',
      align: 'center',
      dataIndex: 'clinic',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => (
        <>
          {
            `${record.clinic.name}`
          }
        </>
      ),
    },
    {
      title: '医生姓名',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'phone',
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
            className='button-color-green'
            onClick={() => {
              setUpdataModalVisible(true)
              setStepFormValues({id: record.id})
            }}
          >
            修改密码
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
        manualRequest
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
          const res = await getDoctorList(form)

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
          onSubmit={async (value) => {
            const success = await doChgPassword(value)

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
