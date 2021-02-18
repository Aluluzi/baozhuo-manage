import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Select,
  Form,
  Row,
  Button
} from 'antd';
import _STATUS from "../../../../../../../drugmall-manage/src/utils/config";

const { Option } = Select;
const boxStyle = {
  background:'#fff',
  padding:20
}

const HookProps = props => {

  const { visible, onSearch, form, info, dispatch } = props;

  useEffect(()=>{
    // if(!visible){
    //   form.resetFields()
    // }
  },[visible])

  const onFinish = (values) => {
    console.log(values)
    // values().then(values => {
    //   // Do something with value
    // });
    // form.validateFields((err, values) => {
    //   if (!err) {
    //     for (let i in values) !values[i] && delete values[i];
    //     if (values.date && values.date.length > 0) {
    //       values.created_at = []
    //       values.created_at[0] = moment(values.date[0]).format('YYYY-MM-DD 00:00:00');
    //       values.created_at[1] = moment(values.date[1]).format('YYYY-MM-DD 23:59:59');
    //
    //       delete values.date
    //     }
    //     onSearch(values);
    //   }
    // });
  };

  const handleChange = () => {
    console.log('change')
  };

  const handleFormReset = ()=>{

  }

  return (
    <div style={boxStyle}>
      <Form layout="inline"  onFinish={onFinish}>
        <Form.Item name="area"  >
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType={onFinish}>
            查询
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={handleFormReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default connect()(HookProps)
