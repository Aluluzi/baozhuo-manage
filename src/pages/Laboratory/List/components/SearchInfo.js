import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Input,
  Form,
  DatePicker,
  Button,
  Row
} from 'antd';

const { RangePicker } = DatePicker;

const HookProps = props => {

  const { visible, onSearch, form, info, dispatch } = props;

  useEffect(()=>{
    if(!visible){
      form.resetFields()
    }
  },[visible])

  const onFinish = () => {
    form.validateFields((err, values) => {
      if (!err) {
        for (let i in values) !values[i] && delete values[i];
        if (values.date && values.date.length > 0) {
          values.created_at = []
          values.created_at[0] = moment(values.date[0]).format('YYYY-MM-DD 00:00:00');
          values.created_at[1] = moment(values.date[1]).format('YYYY-MM-DD 23:59:59');

          delete values.date
        }
        onSearch(values);
      }
    });
  };

  const handleFormReset = () => {
    form.resetFields();
    onSearch();
  };

  return (
    <Form layout="inline"  onFinish={onFinish}>
      <Row type="flex">

        {/*<Form.Item label="活动标题" name="title">*/}
        {/*  {getFieldDecorator('title')(<Input placeholder="请输入标题"/>)}*/}
        {/*</Form.Item>*/}
        {/*<Form.Item label="记录时间">*/}
        {/*  {getFieldDecorator('date')(<RangePicker style={{ width: 240 }} />)}*/}
        {/*</Form.Item>*/}

        {/*<Form.Item>*/}
        {/*  <Button type="primary" onClick={handleSearch}>*/}
        {/*    查询*/}
        {/*  </Button>*/}
        {/*  <Button style={{ marginLeft: 20 }} onClick={handleFormReset}>*/}
        {/*    重置*/}
        {/*  </Button>*/}
        {/*</Form.Item>*/}
      </Row>
    </Form>
  )
}

export default connect()(HookProps)
