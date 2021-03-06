import React, {useRef, useState} from 'react';
import {Modal, Button, Form, Select, Input} from 'antd';
import ChinaArea from "@/components/ChinaArea";

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const {Option} = Select

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const {modalVisible, onCancel, onSubmit, formValues} = props;
  const [loading, setLoading] = useState(false)
  const formData = useRef({})

  function handleOk() {
    setLoading(true)
    form.validateFields().then(values => {
      // console.log(values)
      if (formValues.type === 'password') {
        onSubmit({...values, ...{id: formValues.id, type: formValues.type}})
      } else {
        const {area, discount, ...obj} = values
        onSubmit({
          ...area, ...obj, ...{discount: Number(discount), id: formValues.id, type: formValues.type},
          contactPhone: formValues.contactPhone
        })
      }
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
      title="编辑"
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
        initialValues={formValues.id && formValues.type !== 'password' ? formValues : formData.current}
      >
        {
          formValues.type === 'password' ?
            <Form.Item
              label="类型"
              name="settleMethod"
              rules={[{required: true, message: '请选择类型'}]}
            >
              <Select
                placeholder='请选择类型'
              >
                <Option value={1}>日结</Option>
                <Option value={2}>月结</Option>
              </Select>
            </Form.Item>
            :
            <>
              <Form.Item
                label="区域"
                name="area"
                required
                rules={[{validator: checkPrice}]}
              >
                <ChinaArea disabled/>
              </Form.Item>

              <Form.Item
                label="类型"
                name="settleMethod"
                rules={[{required: true, message: '请输入实验室名称'}]}
              >
                <Select
                  placeholder='请选择类型'
                >
                  <Option value={1}>日结</Option>
                  <Option value={2}>月结</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="诊所名称"
                name="name"
                rules={[{required: true, message: '请输入诊所名称'}]}
              >
                <Input placeholder="请输入诊所名称"/>
              </Form.Item>
              <Form.Item
                label="折扣"
                name="discount"
                rules={[{required: true, message: '请输入折扣，5折即输入50即可'}]}
              >
                <Input placeholder="请输入折扣，5折即输入50即可"/>
              </Form.Item>
            </>
        }
      </Form>
    </Modal>
  );
};

export default CreateForm;
