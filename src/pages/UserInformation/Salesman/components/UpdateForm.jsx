import React, {useRef, useState} from 'react';
import {Modal, Button, Form, Input, Space} from 'antd';
import {ExclamationCircleOutlined, MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

const layoutItem = {
  labelCol: {span: 8},
  // wrapperCol: {span: 12},
};
const {confirm} = Modal;

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const {modalVisible, onCancel, onSubmit, formValues} = props;
  const [loading, setLoading] = useState(false)
  const formData = useRef({})

  function handleOk() {
    setLoading(true)
    form.validateFields().then(values => {
      // console.log(values)
      const {clinicIds, ...obj} = values
      if (clinicIds) {
        onSubmit({
          ...obj, ...{
            clinicIds: clinicIds.map(item => {
              return Number(item.id)
            }), id: formValues.id, type: formValues.type
          }
        })
      } else {
        onSubmit({...obj, ...{id: formValues.id, type: formValues.type}})
      }
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  function endOK() {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined/>,
      content: '是否保存诊所信息?',
      onOk() {
        handleOk()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <Modal
      width={560}
      destroyOnClose
      title={formValues.type === 'password' ?"修改密码" : '编辑绑定诊所'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={[
        <Button key="back" onClick={() => onCancel()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => {
          if (formValues.type === 'password') {
            handleOk()
          } else {
            endOK()
          }
        }}>
          确定
        </Button>,
      ]}
    >
      <Form
        {...layout}
        name="userInformationSalesman"
        form={form}
        initialValues={formValues.id && formValues.type !== 'password' ? formValues : formData.current}
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
            <Form.List name="clinicIds">
              {(fields, {add, remove}) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key}
                           style={{display: 'flex', justifyContent: 'center', marginBottom: 8, paddingLeft: 0}}
                           align="baseline">
                      <Form.Item
                        {...layoutItem}
                        label='诊所编号'
                        name={[field.name, 'id']}
                        rules={[{required: true, message: '请输入诊所编号进行绑定'}]}
                      >
                        <Input placeholder="请输入诊所编号进行绑定"/>
                      </Form.Item>
                      {
                        index === 0 ?
                          <PlusCircleOutlined onClick={() => add()}/>
                          :
                          <MinusCircleOutlined onClick={() => remove(field.name)}/>
                      }
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
        }
      </Form>
    </Modal>
  );
};

export default CreateForm;
