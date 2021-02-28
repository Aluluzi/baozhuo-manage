import React from 'react';
import {connect} from 'dva';
import styles from './index.less';
import FormInlineLogin from './FormInlineLogin';
import {PageContainer} from "@ant-design/pro-layout";

const HookProps = () => {
  return (
    <PageContainer>
      <div className={styles.main}>
        <FormInlineLogin/>
      </div>
    </PageContainer>
  );
};

export default connect()(HookProps);
