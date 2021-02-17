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

    console.log(33)
    history.replace('/');

    // form.validateFields({ force: true }, (err, values) => {
    //   if (!err) {
    //     // values.password = new MD5().update(values.password).digest('hex');
    //     dispatch({ type: 'login/login', payload: values });
    //   }
    // });
    //
    // dispatch({
    //   type: 'login/login',
    //   payload: {...values, type},
    // });
  };

  return (
    <div className={styles.main}>
      <Form className="login-form">
        <Form.Item>
          <Input
            size="large"
            name="username"
            rules={[{required: true, message: '请输入用户名!'}]}
            prefix={<UserOutlined/>}
            placeholder="用户名"
            onPressEnter={e => {
              e.preventDefault();
              handleSubmit();
            }}
          />
        </Form.Item>
        <Form.Item>
          <Input
            size="large"
            name="password"
            rules={[{required: true, message: '请输入密码!'}]}
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
          onClick={handleSubmit}
          className={styles.submit_btn}
        >
          登录
        </Button>
      </Form>
    </div>
  );
};

export default connect()(HookProps)
