import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import configs from '../../../../config/env';

import {
  Input,
  Modal,
  Form,
  Button
} from 'antd';

const HookProps = props => {

  const [link_url, setLink_url] = useState(''),
        { visible, onClose, form, info, dispatch } = props;

  const H5_URL = configs[process.env.API_ENV].H5_URL;

  useEffect(()=>{
    if(visible){
      info.link_url = H5_URL+ '/mjkb-activity/index.html#/openFFM?id=' + info.id
      dispatch({
        type: 'message/Add',
        payload: {
          data:info
        }
      });
      setLink_url(H5_URL+ '/mjkb-activity/index.html#/openFFM?id=' + info.id)
    }
  },[visible])

  const copy = () => {
    const spanText = document.getElementById('copy').value;
    const oInput = document.createElement('input');
    oInput.value = spanText;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand('Copy'); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    document.body.removeChild(oInput);
  }

  return (
    <Modal
      title={info.id
             ? '编辑'
             : '新增'}
      visible={visible}
      footer={null}
      onCancel={onClose}
    >
      {
        link_url && (
          <>
            <Input placeholder="Basic usage" value={link_url} disabled={true} id='copy'/>
            <div style={{display:'flex', justifyContent:'center',marginTop:'20px'}}>
              <Button style={{marginRight:'5px'}} type="primary" onClick={copy}>复制链接</Button>
              <Button type="danger" href='http://tool.chinaz.com/tools/dwz.aspx' target='_brank'>跳转至短连接生成页</Button>
            </div>
          </>
        )
      }
    </Modal>
  )
}

export default Form.create()(connect()(HookProps))
