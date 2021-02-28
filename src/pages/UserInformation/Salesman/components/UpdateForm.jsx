import React, {useRef, useState} from 'react';
import {Modal, Button, Form, Input} from 'antd';

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const {modalVisible, onCancel, onSubmit, formValues} = props;
  const [loading, setLoading] = useState(false)
  const formData = useRef({

  })

  function handleOk() {
    setLoading(true)
    form.validateFields().then(values => {
      // console.log(values)
      const {clinicId, ...obj} = values
      if (clinicId) {
        onSubmit({...obj, ...{clinicId: Number(clinicId), id: formValues.id, type: formValues.type}})
      } else {
        onSubmit({...obj, ...{id: formValues.id, type: formValues.type}})
      }
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <Modal
      width={560}
      destroyOnClose
      title="绑定其他诊所"
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
        {
          formValues.type === 'password' ?
            <Form.Item
              label="新密码"
              name="password"
              rules={[{required: true, message: '请输入新密码'}]}
            >
              <Input placeholder="请输入新密码"/>
            </Form.Item>
            :
            <Form.Item
              label="诊所编号"
              name="clinicId"
              rules={[{required: true, message: '请输入诊所编号进行绑定'}]}
            >
              <Input placeholder="请输入诊所编号进行绑定"/>
            </Form.Item>
        }
      </Form>
    </Modal>
  );
};

export default CreateForm;
