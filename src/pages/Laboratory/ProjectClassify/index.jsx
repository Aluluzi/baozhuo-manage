import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Modal, Select} from 'antd';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import {getCategoryList, getLabList, saveCategory, setCategoryStatus} from '@/services/laboratory';
import {connect} from "dva";
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {confirm} = Modal;
const {Option} = Select

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await saveCategory(fields);
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
    await setCategoryStatus({
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
  const [currentLab, setCurrentLab] = useState(null)
  const [labList, setLab] = useState([])
  const actionRef = useRef();
  const queryParams = useRef({
    labId: null,
    size: null,
    page: null
  });

  // 获取实验室列表
  const getLab = useCallback(
    async () => {
      try {
        const res = await getLabList({size: 100, page: 1});
        const id = res.data.data ? res.data.data[0].id : null
        queryParams.current = {...queryParams.current, ...{labId: id}}
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
      title: '实验室',
      dataIndex: 'labId',
      // colSize:2,
      hideInForm: true,
      hideInTable: true,
      renderFormItem: () => {
        function handleChange(data) {
          queryParams.current = {...queryParams.current, ...{labId: data}}
          setCurrentLab(data)
          actionRef.current.reloadAndRest()
          // console.log(queryParams.current)
        }

        return (
          <Select value={currentLab} style={{width: 120}} placeholder="实验室"
                  onChange={(v) => handleChange(v, 'province')}>
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
      title: '序号',
      width: 80,
      align: 'center',
      valueType: 'index',
      hideInSearch: true,
      hideInForm: true
    },
    {
      title: '实验室',
      dataIndex: 'labName',
      align: 'center',
      hideInSearch: true,
      hideInForm: true
    },
    {
      title: '分类',
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
          // console.log(queryParams.current)
          const form = {
            ...queryParams.current,
            ...{
              // labId: currentLab,
              page: params.current,
              size: params.pageSize,
            }
          }
          // form.lastId =0 || params.current
          let obj = {}
          try {
            const res = await getCategoryList(form)
            obj = {
              data: res.data.data,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: true,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: res.data.total,
            };
          } catch (e) {
            console.log(e)
          }
          return obj
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
