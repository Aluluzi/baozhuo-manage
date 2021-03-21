import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onCancel, onSubmit, formValues } = props;
  const [loading, setLoading] = useState(false);

  function handleOk() {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        // console.log(values)
        onSubmit({ ...values, ...{ id: formValues.id, clinicId: Number(values.clinicId) } });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Modal
      width={560}
      destroyOnClose
      title="修改密码"
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
      <Form {...layout} name="userInformationUpDoctor" form={form} initialValues={formValues}>
        <Form.Item
          label="医生姓名"
          name="name"
          rules={[{ required: true, message: '请输入医生姓名' }]}
        >
          <Input placeholder="请输入医生姓名" />
        </Form.Item>
        <Form.Item
          label="登录手机号"
          name="phone"
          rules={[{ required: true, message: '请输入登录手机号' }]}
        >
          <Input placeholder="请输入登录手机号" />
        </Form.Item>
        <Form.Item
          label="诊所编号"
          name="clinicId"
          rules={[{ required: true, message: '请输入诊所编码' }]}
        >
          <Input placeholder="请输入诊所编码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
