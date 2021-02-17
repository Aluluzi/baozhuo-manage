import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formLayout } from '@/utils/initial';
import Upload from '@/components/Upload';
import {
  Input,
  Icon,
  Radio,
  Modal,
  Form,
  DatePicker,
  Button
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const HookProps = props => {

  const [img, setImg] = useState(''),
    [loading, setLoading] = useState(false),
    { visible, onClose, form, info, dispatch } = props,
    { getFieldDecorator } = form;

  useEffect(()=>{
    if(visible){
      setImg(info.main_image)
    }else{
      form.resetFields()
    }
  },[visible,info.main_image])

  const handleSubmit = () => {
    form.validateFields((err, values) => {
      if ( !err ) {
        values.main_image = img;
        info.id && (values.id = info.id)
        dispatch({
          type: 'message/Add',
          payload: {
            data:values
          },
          callback:()=>{
            onClose(true)
          }
        });
      }
    });
  }

  // 图片结构初始化
  const initFile = url => {
    let fileList = [];
    url && fileList.push({ uid: 1, url });
    return fileList;
  };
  // 图片values解析
  const normFile = e => {
    if ( Array.isArray(e) ) return e;
    return e && e.fileList;
  };
  // 文件上传监控
  const uploadImg = ({ file }) => {
    const { status } = file;
    status === 'uploading' && setLoading(true);
    if ( status === 'done' ) {
      setImg(file.response)
      setLoading(false)
    }
  };

  return (
    <Modal
      title={info.id
             ? '编辑'
             : '新增'}
      visible={visible}
      // footer={null}
      onOk={handleSubmit}
      onCancel={onClose}
    >

      <Form {...formLayout}>
        <Form.Item label="活动标题" name="title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请填写标题！' }],
            initialValue: info.title,
          })(<Input placeholder="请输入标题" style={{ width: 278 }}/>)}
        </Form.Item>
        <Form.Item label="活动内容" name="content">
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请填写标题！' }],
            initialValue: info.content,
          })(<TextArea rows={4} placeholder="请输入内容" style={{ width: 278 }}/>)}
        </Form.Item>
        <Form.Item label="跳转APP内H5地址" name="redirect_url">
          {getFieldDecorator('redirect_url', {
            rules: [{ required: true, message: '请填写标题！' }],
            initialValue: info.redirect_url,
          })(<Input placeholder="请输入跳转地址" style={{ width: 278 }}/>)}
        </Form.Item>
        <Form.Item label="图片">
          {getFieldDecorator('main_image', {
            initialValue: initFile(info.main_image),
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
            rules: [
              {
                required: true,
                message: '请上传一张主图',
              },
            ],
          })(
            <Upload
              onRemove={()=>setImg('')}
              onChange={uploadImg}
              listType="picture-card"
              showUploadList={false}
            >
              {img
               ? (<img src={img} style={{ width: 86, height: 86 }}/>)
               : (
                 <div>
                   <Icon type={loading
                               ? 'loading'
                               : 'plus'}/>
                   <div className="ant-upload-text">上传</div>
                 </div>
               )}
            </Upload>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(connect()(HookProps))
