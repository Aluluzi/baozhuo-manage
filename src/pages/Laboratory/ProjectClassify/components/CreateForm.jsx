import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Modal, Button, Form, Select, Input } from 'antd';
import {getLabList} from "@/services/laboratory";
import debounce from 'lodash/debounce';

const {Option} = Select
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onCancel, onSubmit } = props;
  const [loading,setLoading] = useState(false)
  const formData = useRef({
    name:'',
    labId:''
  })
  const [labList,setLabList] = useState([])

  // 获取实验室
  const getList = debounce(useCallback(
    async (v) => {
      try {
        const res = await getLabList({size:100,lastId:0,name:v || ''});
        setLabList(res.data.data || [])
      } catch (e) {
        console.log(e)
      }
    },[]
  ),800)

  useEffect(() => {
    getList();
  }, [getList]);

  function handleOk() {
    setLoading(true)
    // form.submit()
    form.validateFields().then(values =>{
      console.log(values)
      onSubmit(values)
      setLoading(false)
    }).catch(err =>{
      console.log(err)
    })
  }

  return (
    <Modal
      form={form}
      width={560}
      destroyOnClose
      title="新增实验室"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={[
        <Button key="back" onClick={() => onCancel()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          确定
        </Button>,
      ]}
    >
      <Form
        {...layout}
        name="projectClassify"
        initialValues={formData.current}
        form={form}
      >
        <Form.Item
          label="实验室"
          name="labId"
          required
          rules={[{ required: true, message: '请选择实验室' }]}
        >
          <Select
            showSearch
            filterOption={false}
            placeholder='请选择实验室'
            onSearch={getList}
          >
            {
              labList.map( (item) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item
          label="分类"
          name="name"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateForm;
