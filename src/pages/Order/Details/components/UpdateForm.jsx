import React, {useEffect, useState} from 'react';
import {Modal, Button, Form, Input} from 'antd';

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const layoutItem = {
  labelCol: {span: 6},
  // wrapperCol: {span: 12},
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const {modalVisible, onCancel, onSubmit, formValues} = props;
  const [loading, setLoading] = useState(false)

  function handleOk() {
    setLoading(true)
    form.validateFields().then(values => {
      const codes = values.codes.map(item => {
        return {
          id: item.id,
          code: item.code
        }
      })
      onSubmit({...values, ...{id: formValues.id, codes}})
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    // list
  })

  return (
    <Modal
      width={560}
      destroyOnClose
      title="修改条码"
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
        initialValues={formValues}
      >
        <Form.List name="codes">
          {(fields) => (
            <>
              {fields.map((field) => (
                <Form.Item
                  key={field.key}
                  {...layoutItem}
                  label={formValues.codes[field.name].tubeName}
                  name={[field.name, 'code']}
                  rules={[{required: true, message: '请输入条码'}]}
                >
                  <Input placeholder="请输入条码"/>
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreateForm;
