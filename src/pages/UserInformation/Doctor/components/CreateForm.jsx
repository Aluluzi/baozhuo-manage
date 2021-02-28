import React, {useRef, useState} from 'react';
import {Modal, Button, Form, Input, Select} from 'antd';

const {Option} = Select
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
      const {clinicId, ...obj} = values
      onSubmit({...obj, ...{clinicId: Number(clinicId), phone: values.username}})
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <Modal
      width={560}
      destroyOnClose
      title="新增医生"
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
        name="userInformationClinic"
        form={form}
        initialValues={formData.current}
      >

        <Form.Item
          label="类型"
          name="roleType"
          rules={[{required: true, message: '请输入实验室名称'}]}
        >
          <Select
            placeholder='请选择类型'
          >
            <Option value={3}>诊所管理员</Option>
            <Option value={4}>诊所医生</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="诊所编号"
          name="clinicId"
          rules={[{required: true, message: '请输入诊所编号进行绑定'}]}
        >
          <Input placeholder="请输入诊所编号进行绑定"/>
        </Form.Item>
        <Form.Item
          label="医生姓名"
          name="name"
          rules={[{required: true, message: '请输入医生姓名'}]}
        >
          <Input placeholder="请输入医生姓名"/>
        </Form.Item>
        <Form.Item
          label="登录手机号"
          name="username"
          rules={[{required: true, message: '请输入医生登录手机号'}]}
        >
          <Input placeholder="请输入医生登录手机号"/>
        </Form.Item>
        <Form.Item
          label="登录密码"
          name="password"
          rules={[{required: true, message: '请输入医生登录密码'}]}
        >
          <Input placeholder="请输入医生登录密码"/>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateForm;
