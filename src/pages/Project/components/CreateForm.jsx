import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Button, Form, Select, Input, Radio, Row, Space, InputNumber, Switch } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getTubeList } from '@/services/laboratory';
import { getClinicList } from '@/services/userInformation';
import debounce from 'lodash/debounce';
import styles from './index.less';

const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onCancel, onSubmit, formValues } = props;
  const [loading, setLoading] = useState(false);
  const formData = useRef({
    isPromotion: false,
    Tubes: [
      {
        fieldKey: 0,
        isListField: true,
        key: 0,
        id: null,
      },
    ],
    items: [
      {
        fieldKey: 0,
        isListField: true,
        key: 0,
        name: null,
      },
    ],
    Promotions: [
      {
        fieldKey: 0,
        isListField: true,
        key: 0,
        name: null,
      },
    ],
  });
  const [isCombo, setIsCombo] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);
  const [labList, setLabList] = useState([]);
  const [clinicList, setClinicList] = useState([]);

  // 获取诊所列表
  const getClinic = useCallback(async () => {
    try {
      const res = await getClinicList({ size: 10000, page: 1, status: '1' });
      setClinicList(res.data.data || []);
    } catch (e) {
      console.log(e);
    }
  });

  // 获取耗材
  const getList = debounce(
    useCallback(async (v) => {
      try {
        const res = await getTubeList({ size: 10000, page: 1, name: v || '', status: '1' });
        setLabList(res.data.data || []);
      } catch (e) {
        console.log(e);
      }
    }),
    800,
  );

  useEffect(() => {
    if (formValues.id) {
      setIsCombo(formValues.isCombo);
      setIsSpecial(formValues.isPromotion);
    }
    getList();
    getClinic();
  }, []);

  // 是否特殊项目
  function handleChange(e) {
    setIsSpecial(e);
  }

  function handleOk() {
    setLoading(true);
    // form.submit()
    form
      .validateFields()
      .then((values) => {
        console.log(isSpecial);
        const s = {
          isCombo,
          isPromotion: values.isPromotion,
          inspectionMethod: values.inspectionMethod,
          price: values.price * 100,
          name: values.name,
          clinicalApply: values.clinicalApply,
          remark: values.remark,
          reportTime: values.reportTime,
          sampleRequire: values.sampleRequire,
          storageCondition: values.storageCondition,
        };
        s.Tubes = values.Tubes.map((item) => {
          return {
            id: item.id,
          };
        });

        // 是否套餐
        if (isCombo) {
          s.items = values.items.map((item) => {
            return {
              name: item.name,
              code: item.code,
            };
          });
        } else {
          s.code = values.code;
        }

        // 是否特殊项目
        if (isSpecial) {
          s.Promotions = values.Promotions.map((item) => {
            return {
              price: parseInt(Number(item.price) * 100, 10),
              clinicId: item.clinicId,
            };
          });
        } else {
          s.Promotions = [];
        }
        // console.log(s)
        // 编辑状态增加id
        if (formValues.id) {
          s.id = formValues.id;
        }
        // console.log(s)
        onSubmit(s);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  return (
    <Modal
      form={form}
      width={560}
      destroyOnClose
      title={formValues.id ? '编辑项目' : '新增项目'}
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
      {formValues.id ? null : (
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Radio.Group
            value={isCombo}
            onChange={(e) => {
              setIsCombo(e.target.value);
            }}
            buttonStyle="solid"
          >
            <Radio.Button value={true}>套餐项目</Radio.Button>
            <Radio.Button value={false}>单个项目</Radio.Button>
          </Radio.Group>
        </Row>
      )}
      <Form
        {...layout}
        name="project"
        initialValues={formValues.id ? formValues : formData.current}
        form={form}
      >
        <Form.Item
          label="项目名称"
          name="name"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          label="样本要求"
          name="sampleRequire"
          rules={[{ required: true, message: '请输入样本要求' }]}
        >
          <Input placeholder="请输入样本要求" />
        </Form.Item>

        <Form.List name="Tubes">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 8,
                    paddingLeft: 8,
                  }}
                  align="baseline"
                  key={field.key}
                  className={styles.spaceItem}
                >
                  <Form.Item
                    {...field}
                    {...layout}
                    label="耗材"
                    name={[field.name, 'id']}
                    required
                    rules={[{ required: true, message: '请选择耗材' }]}
                  >
                    <Select
                      showSearch
                      filterOption={false}
                      placeholder="请选择选择耗材"
                      onSearch={getList}
                    >
                      {labList.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {index === 0 ? (
                    <PlusCircleOutlined onClick={() => add()} />
                  ) : (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  )}
                </Space>
              ))}
            </>
          )}
        </Form.List>

        {isCombo ? (
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: 8,
                      paddingLeft: 28,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      label="子项名称"
                      labelCol={{ span: 10 }}
                      name={[field.name, 'name']}
                      fieldKey={[field.fieldKey, 'first']}
                      rules={[{ required: true, message: '请输入子项名称' }]}
                    >
                      <Input placeholder="请输入子项名称" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="代号"
                      name={[field.name, 'code']}
                      fieldKey={[field.fieldKey, 'last']}
                      rules={[{ required: true, message: '请输入代号' }]}
                    >
                      <Input placeholder="请输入代号" />
                    </Form.Item>
                    {index === 0 ? (
                      <PlusCircleOutlined onClick={() => add()} />
                    ) : (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        ) : (
          <Form.Item label="代号" name="code" rules={[{ required: true, message: '请输入代号' }]}>
            <Input placeholder="请输入代号" />
          </Form.Item>
        )}
        <Form.Item
          label="报告时间"
          name="reportTime"
          rules={[{ required: true, message: '请输入报告时间' }]}
        >
          <Input placeholder="请输入报告时间" />
        </Form.Item>
        <Form.Item
          label="收费标准（元）"
          name="price"
          rules={[{ required: true, message: '请输入收费标准（元）' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入收费标准（元）" />
        </Form.Item>
        <Form.Item
          label="临床应用"
          name="clinicalApply"
          rules={[{ required: true, message: '请输入临床应用称' }]}
        >
          <Input placeholder="请输入临床应用称" />
        </Form.Item>
        <Form.Item
          label="保存条件"
          name="storageCondition"
          rules={[{ required: true, message: '请输入保存条件' }]}
        >
          <Input placeholder="请输入保存条件" />
        </Form.Item>
        <Form.Item
          label="检测方法"
          name="inspectionMethod"
          rules={[{ required: true, message: '请输入检测方法' }]}
        >
          <Input placeholder="请输入检测方法" />
        </Form.Item>
        <Form.Item
          label="其他备注"
          name="remark"
          rules={[{ required: false, message: '其他备注' }]}
        >
          <Input placeholder="请输其他备注" />
        </Form.Item>
        <Form.Item
          label="是否特殊项目"
          name="isPromotion"
          valuePropName="checked"
          rules={[{ required: true, message: '是否特殊项目' }]}
        >
          <Switch onChange={handleChange} />
        </Form.Item>

        {isSpecial ? (
          <Form.List name="Promotions">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: 8,
                      paddingLeft: 58,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      label="诊所"
                      style={{ width: 220 }}
                      labelCol={{ span: 8 }}
                      name={[field.name, 'clinicId']}
                      fieldKey={[field.fieldKey, 'first']}
                      rules={[{ required: true, message: '请选择诊所' }]}
                    >
                      <Select placeholder="请选择诊所">
                        {clinicList.map((item) => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="价格"
                      labelCol={{ span: 8 }}
                      name={[field.name, 'price']}
                      fieldKey={[field.fieldKey, 'last']}
                      rules={[{ required: true, message: '请输入价格' }]}
                    >
                      <Input placeholder="请输入价格" />
                    </Form.Item>
                    {index === 0 ? (
                      <PlusCircleOutlined onClick={() => add()} />
                    ) : (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        ) : null}
      </Form>
    </Modal>
  );
};

export default CreateForm;
