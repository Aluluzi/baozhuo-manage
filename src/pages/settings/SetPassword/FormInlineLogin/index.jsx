import styles from './index.less';
import React, {useState, useEffect} from 'react';
import {Form, Input, Button, message} from 'antd';
import {chgMyPassword} from '@/services/login'

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

const HorizontalLoginForm = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  const checkPrice = (_, value) => {
    if (form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('二次密码不一致'));

  };

  const onFinish = async (values) => {
    // console.log('Finish:', values);
    try {
      const res = await chgMyPassword({
        oldPassword: values.oldPassword,
        password: values.password,
      })
      message.success(res.message);
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <Form
      form={form}
      name="setPassword"
      {...formItemLayout}
      onFinish={onFinish}
    >
      <Form.Item
        label="旧密码"
        name="oldPassword"
        rules={[
          {
            required: true,
            message: '请输入旧密码',
          },
        ]}
      >
        <Input placeholder="请输入旧密码"/>
      </Form.Item>
      <Form.Item
        label="新密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入新密码',
          },
        ]}
      >
        <Input
          type="password"
          placeholder="请输入新密码"
        />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="confirmPassword"
        required
        rules={[{validator: checkPrice}]}
      >
        <Input
          type="password"
          placeholder="请二次输入密码"
        />
      </Form.Item>
      <Form.Item shouldUpdate={true} style={{justifyContent: 'center', textAlign: 'center'}}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({errors}) => errors.length).length
            }
          >
            提交
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default () => (
  <div className={styles.container}>
    <div id="components-form-demo-inline-login">
      <HorizontalLoginForm/>
    </div>
  </div>
);
