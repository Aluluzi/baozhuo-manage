import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Form, Card, message, Radio} from 'antd'; // import TagSelect from '@/components/TagSelect';

import styles from './index.less';
import TableBasic from './TableBasic';
import {saveInspection, getInspectionList, exportInspection} from '@/services/project';
import {PageContainer} from '@ant-design/pro-layout';
import {getCategoryList, getLabList} from '@/services/laboratory';
import CreateForm from './components/CreateForm';
import {ajaxPrefix} from '@/utils/request';

const FormItem = Form.Item;

const Project = () => {
  const params = useRef({
    size: '',
    page: '',
    currentLab: '',
    currentCategoryId: '',
  });
  const [createModalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [list, setList] = useState([]);
  const [currentLab, setCurrentLab] = useState(null);
  const [labList, setLab] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  /**
   * 添加节点
   * @param fields
   */

  const handleAdd = async fields => {
    const hide = message.loading('正在添加');

    try {
      await saveInspection(fields);
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
   * 编辑
   * @param data
   */

  function toUpdate(data) {
    // console.log(data)
    const {Items, ...obj} = data;
    setStepFormValues({
      ...obj,
      ...{
        items: Items,
      },
    });
    handleModalVisible(true);
  } // 获取列表

  const getList = async ({labId, categoryId, size, page}) => {
    try {
      const res = await getInspectionList({
        size,
        page,
        labId,
        categoryId,
      }); // console.log(res)

      setList(res.data.data || []); // eslint-disable-next-line no-use-before-define

      // eslint-disable-next-line no-use-before-define
      setPagination(e => {
        return {
          ...e,
          ...{
            total: res.data.total,
          },
        };
      });
    } catch (e) {
      console.log(e);
    }
  }; // 获取类目列表

  const getProjectClassify = useCallback(
    async v => {
      try {
        const res = await getCategoryList({
          size: 100,
          page: 1,
          labId: v,
        }); // console.log(res)

        const id = res.data.data ? res.data.data[0].id : null;
        setCurrentCategoryId(id);
        getList({
          labId: v,
          categoryId: id,
          size: params.current.size,
          page: params.current.page,
        });
        setCategoryList(res.data.data || []);
      } catch (err) {
        setList([]); // eslint-disable-next-line no-use-before-define

        // eslint-disable-next-line no-use-before-define
        setPagination(e => {
          return {
            ...e,
            ...{
              total: 0,
            },
          };
        });
        console.log(err);
      }
    },
    [currentLab, currentCategoryId]
  ); // 获取实验室列表

  const getLab = useCallback(async () => {
    try {
      const res = await getLabList({
        size: 100,
        page: 1,
      }); // console.log(res)

      const id = res.data.data ? res.data.data[0].id : null;
      setCurrentLab(id);
      getProjectClassify(id);
      setLab(res.data.data || []);
    } catch (e) {
      console.log(e);
    }
  }, []); // const actionsText = {
  //   expandText: '展开',
  //   collapseText: '收起',
  //   selectAllText: '全部',
  // }
  // 实验室变更

  function handleLabChange(e) {
    setCurrentLab(e.target.value);
    getProjectClassify(e.target.value); // console.log(v)
    // getList({
    //   labId: e.target.value,
    //   categoryId: currentCategoryId,
    //   size: params.current.size,
    //   page: params.current.page
    // })
  } // 类目变更

  function handleCategoryChange(e) {
    setCurrentCategoryId(e.target.value); // console.log(v)

    getList({
      labId: currentLab,
      categoryId: e.target.value,
      size: params.current.size,
      page: params.current.page,
    });
  }

  /**
   * 导出
   */

  async function doExport(l) {
    try {
      const ids = l.map(item => item.id);
      const res = await exportInspection({
        labId: params.current.currentLab,
        categoryId: params.current.currentCategoryId,
        size: 100,
        page: 1,
        ids,
      });
      console.log(res);
      window.open(`${ajaxPrefix}/file/${res.data}`);
    } catch (e) {
      console.log(e);
    }
  }

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: null,
    showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条`,
    showSizeChanger: true,
    onChange: (page, pageSize) => {
      // console.log(page, pageSize)
      setPagination(e => {
        return {
          ...e,
          ...{
            current: e.pageSize !== pageSize ? 1 : page,
            pageSize,
          },
        };
      });
      setTimeout(() => {
        getList({
          size: pageSize,
          page,
          labId: params.current.currentLab,
          categoryId: params.current.currentCategoryId,
        });
      });
    },
  });
  useEffect(() => {
    getLab();
  }, [getLab]);
  useEffect(() => {
    // console.log(pagination)
    params.current = {
      page: pagination.current,
      size: pagination.pageSize,
      currentLab,
      currentCategoryId,
    };
  }, [currentLab, currentCategoryId, pagination]);

  return (
    <PageContainer className={styles.coverCardList}>
      <Card bordered={false}>
        <Form>
          <FormItem>
            <Radio.Group value={currentLab} onChange={handleLabChange} buttonStyle="solid">
              {labList.map(item => (
                <Radio.Button value={item.id} key={item.id}>
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </FormItem>
          <FormItem>
            <Radio.Group
              value={currentCategoryId}
              onChange={handleCategoryChange}
              buttonStyle="solid"
            >
              {categoryList.map(item => (
                <Radio.Button value={item.id} key={item.id}>
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </FormItem>
          <FormItem
            style={{
              marginBottom: 0,
            }}
          >
            <Button>批量上传</Button>
            <Button onClick={() => doExport(list)}>导出项目</Button>
            <Button onClick={() => doExport(list)}>导出模板</Button>
            <Button onClick={() => handleModalVisible(true)}>新增项目</Button>
          </FormItem>
        </Form>
      </Card>
      <Card
        style={{
          marginTop: 24,
        }}
      >
        <TableBasic toUpdate={toUpdate} data={list} pagination={pagination}/>
      </Card>
      {createModalVisible ? (
        <CreateForm
          onSubmit={async value => {
            const data = {
              ...value,
              ...{
                labId: currentLab,
                categoryId: currentCategoryId,
              },
            };
            const success = await handleAdd(data);

            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              getList({
                labId: currentLab,
                categoryId: currentCategoryId,
                size: params.current.size,
                page: params.current.page,
              });
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
            setStepFormValues({});
          }}
          currentLab={currentLab}
          modalVisible={createModalVisible}
          formValues={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
};

export default Project;
