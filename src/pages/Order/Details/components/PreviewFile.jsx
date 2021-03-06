import React from 'react';
import {Modal, Button, List} from 'antd';
import {ajaxPrefix} from "@/utils/request";

const CreateForm = (props) => {
  const {modalVisible, onCancel, formValues} = props;

  function viewFile(url) {
    if (url) {
      window.open(`${ajaxPrefix}/preview/${url}`)
    }
  }

  function expectFile(url) {
    if (url) {
      window.open(`${ajaxPrefix}/file/${url}`)
    }
  }

  return (
    <Modal
      width={560}
      destroyOnClose
      title="报告列表"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={[
        <Button key="back" onClick={() => onCancel()}>
          关闭
        </Button>,
      ]}
    >
      <List
        itemLayout="horizontal"
        dataSource={formValues}
        renderItem={(item, index) => (
          <List.Item>
            {`报告${index + 1}`}
            <Button style={{marginLeft: 32, marginRight: 32}} type="primary" className='button-color-purple'
                    onClick={() => viewFile(item)}>
              查看
            </Button>
            <Button type="primary" onClick={() => expectFile(item)}>
              导出
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default CreateForm;
