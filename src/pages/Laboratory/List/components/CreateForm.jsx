import React, {useRef, useState} from 'react';
import { Modal, Button, Form, Input } from 'antd';
import ChinaArea from '@/components/ChinaArea'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onCancel, onSubmit } = props;
  const [loading,setLoading] = useState(false)
  const formData = useRef({
    name:''
  })

  function handleOk() {
    setLoading(true)
    form.validateFields().then(values =>{
      // console.log(values)
      onSubmit(values)
      setLoading(false)
    }).catch(err =>{
      console.log(err)
    })
  }

  const checkPrice = (_, value) => {
    if (value.provinceId && value.cityId && value.areaId) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请完善区域'));

  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
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
        name="laboratory"
        form={form}
        initialValues={formData.current}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="区域"
          name="area"
          required
          rules={[{validator:checkPrice}]}
        >
          <ChinaArea/>
        </Form.Item>

        <Form.Item
          label="实验室名称"
          name="name"
          rules={[{ required: true, message: '请输入实验室名称' }]}
        >
          <Input placeholder="请输入实验室名称"/>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateForm;
