import {Alert, Space, message, Icon, Form, Input, Button} from 'antd';
import React, {useState} from 'react';
import {connect} from 'dva';
import {useIntl} from 'umi';
import styles from './index.less';
import MD5 from 'md5.js';
import {useHistory} from "react-router-dom";
import {UserOutlined, LockOutlined} from '@ant-design/icons';


const HookProps = props => {
  const {submitting, dispatch} = props;
  const [form] = Form.useForm();
  const history = useHistory();
  // const [type, setType] = useState('account');

  const handleSubmit = (values) => {

    // history.replace('/');
    console.log(values)
    dispatch({ type: 'login/login', payload: values });

  };

  return (
    <div className={styles.main}>
      <Form className="login-form" onFinish={handleSubmit}>
        <Form.Item  name="username"
                    rules={[{required: true, message: '请输入用户名!'}]}>
          <Input
            size="large"
            prefix={<UserOutlined/>}
            placeholder="用户名"
            onPressEnter={e => {
              e.preventDefault();
              handleSubmit();
            }}
          />
        </Form.Item>
        <Form.Item name="password"
                   rules={[{required: true, message: '请输入密码!'}]}>
          <Input
            size="large"
            prefix={<LockOutlined/>}
            type="password"
            placeholder="密码"
            onPressEnter={e => {
              e.preventDefault();
              handleSubmit();
            }}
          />
        </Form.Item>
        <Button
          size="large"
          type="primary"
          block
          shape="round"
          loading={submitting}
          className={styles.submit_btn}
          htmlType="submit"
        >
          登录
        </Button>
      </Form>
    </div>
  );
};

export default connect()(HookProps)
