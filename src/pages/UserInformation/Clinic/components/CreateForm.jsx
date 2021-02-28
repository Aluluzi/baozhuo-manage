import React, {useRef, useState} from 'react';
import {Modal, Button, Form, Input, Select} from 'antd';
import ChinaArea from '@/components/ChinaArea'

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
      const {area, discount, ...obj} = values
      onSubmit({...area, ...obj, ...{discount: Number(discount)}})
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
      title="新增诊所"
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
          label="区域"
          name="area"
          required
          rules={[{validator: checkPrice}]}
        >
          <ChinaArea/>
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
        <Form.Item
          label="业务员手机"
          name="contactPhone"
          rules={[{required: false, message: '请输入业务员手机号（选填）'}]}
        >
          <Input placeholder="请输入业务员手机号（选填）"/>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateForm;
