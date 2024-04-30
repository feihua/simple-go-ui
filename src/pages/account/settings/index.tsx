import React from 'react';
import { message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent, updatePassword } from './service';

import styles from './BaseView.less';
import { UpdatePasswordParams } from './data';

const BaseView: React.FC = () => {
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent({ id: 1 });
  });

  const handleFinish = async (value: UpdatePasswordParams) => {
    const success = await updatePassword(value);
    if (success) {
      message.success('更新基本信息成功');
    }
  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
              }}
            >
              <ProFormText
                width="md"
                name="mobilePsw"
                label="新密码"
                rules={[
                  {
                    required: true,
                    message: '请输入您的新密码!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="rePwd"
                label="确认密码"
                rules={[
                  {
                    required: true,
                    message: '请输入您的确认密码!',
                  },
                ]}
              />
            </ProForm>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
