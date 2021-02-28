import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import FormNormalLogin from './FormNormalLogin';

const HookProps = () => {
  return (
    <div className={styles.main}>
      <FormNormalLogin />
    </div>
  );
};

export default connect()(HookProps);
