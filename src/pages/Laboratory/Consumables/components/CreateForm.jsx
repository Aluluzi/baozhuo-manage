import React, {useState} from 'react';
import {Modal, Button, Form, Input, Upload, message} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {ajaxPrefix} from '@/utils/request'

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const {modalVisible, onCancel, onSubmit} = props;
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState('')

  const [imgLoading, setImgLoading] = useState(false)

  const uploadButton = (
    <div>
      {imgLoading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  function handleChange(info) {
    if (info.file.status === 'uploading') {
      setImgLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setImgLoading(false)
      // console.log(info.file.response.data)
      setImg(`${ajaxPrefix}/file/${info.file.response.data}`)
    }
  };

  function handleOk() {
    setLoading(true)
    // form.submit()
    form.validateFields().then(values => {
      console.log(values)
      onSubmit({
        name:values.name,
        img:values.img.file.response.data
      })
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  const checkPrice = (_, value) => {
    // console.log(value)
    if (value && value.file.status === 'done' && value.file.response.code === 200) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请上传文件'));

  };

  return (
    <Modal
      width={560}
      destroyOnClose
      title="新增耗材"
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
        name="laboratory-consumables"
        form={form}
      >
        <Form.Item
          label="耗材名称"
          name="name"
          rules={[{required: true, message: '请输入耗材名称'}]}
        >
          <Input placeholder="请输入耗材名称"/>
        </Form.Item>

        <Form.Item
          label="图片"
          name="img"
          required
          rules={[{validator: checkPrice}]}
        >
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`${ajaxPrefix}/file`}
            beforeUpload={beforeUpload}
            // customRequest={doImgUpload}
            onChange={handleChange}
          >
            {img ? <img src={img} alt="avatar" style={{width: '100%'}}/> : uploadButton}
          </Upload>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateForm;
