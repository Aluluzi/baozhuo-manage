import React, {useRef, useState} from 'react';
import {Modal, Button, Form, Input} from 'antd';
import ChinaArea from '@/components/ChinaArea'

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const {modalVisible, onCancel, onSubmit} = props;
  const [loading, setLoading] = useState(false)
  const formData = useRef({
    name: ''
  })

  function handleOk() {
    setLoading(true)
    form.validateFields().then(values => {
      // console.log(values)
      const {area, clinicId, ...obj} = values
      onSubmit({...area, ...obj, ...{clinicId: Number(clinicId), phone: values.username, roleType: 2}})
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  const checkPrice = (_, value) => {
    if (value.provinceId && value.cityId && value.areaId) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请完善区域'));

  };

  return (
    <Modal
      width={560}
      destroyOnClose
      title="新增业务员"
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
        name="userInformationSalesman"
        form={form}
        initialValues={formData.current}
      >
        <Form.Item
          label="区域"
          name="area"
          required
          rules={[{validator: checkPrice}]}
        >
          <ChinaArea/>
        </Form.Item>

        <Form.Item
          label="诊所编号"
          name="clinicId"
          rules={[{required: true, message: '请输入诊所编号进行绑定'}]}
        >
          <Input placeholder="请输入诊所编号进行绑定"/>
        </Form.Item>
        <Form.Item
          label="业务员姓名"
          name="name"
          rules={[{required: true, message: '请输入业务员姓名'}]}
        >
          <Input placeholder="请输入业务员姓名"/>
        </Form.Item>
        <Form.Item
          label="登录手机号"
          name="username"
          rules={[{required: true, message: '请输登录手机号'}]}
        >
          <Input placeholder="请输登录手机号可"/>
        </Form.Item>
        <Form.Item
          label="登录密码"
          name="password"
          rules={[{required: false, message: '请输入业务员登录密码'}]}
        >
          <Input placeholder="请输入业务员登录密码"/>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateForm;
