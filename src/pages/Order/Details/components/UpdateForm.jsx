import React, {useEffect, useState} from 'react';
import {Modal, Button, Form, Input, Space} from 'antd';

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const layoutItem = {
  labelCol: {span: 8},
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
                <Space key={field.key}
                       style={{display: 'flex', justifyContent: 'center', marginBottom: 8, paddingLeft: 0}}
                       align="baseline">
                  <Form.Item
                    {...layoutItem}
                    label={formValues.codes[field.name].tubeName}
                    name={[field.name, 'code']}
                    rules={[{required: true, message: '请输入诊所编号进行绑定'}]}
                  >
                    <Input placeholder="请输入诊所编号进行绑定"/>
                  </Form.Item>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreateForm;
