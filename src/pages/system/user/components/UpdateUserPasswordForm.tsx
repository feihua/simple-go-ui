import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { UpdatePasswordParams, UserListItem } from '../data.d';

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: Partial<UpdatePasswordParams>) => void;
  updatePasswordModalVisible: boolean;
  currentData: Partial<UserListItem>;
}
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateUserPasswordForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();

  const { onSubmit, onCancel, updatePasswordModalVisible, currentData } = props;

  useEffect(() => {
    if (form && !updatePasswordModalVisible) {
      form.resetFields();
    }
  }, [props.updatePasswordModalVisible]);

  useEffect(() => {
    if (currentData) {
      form.setFieldsValue({
        ...currentData,
        // deptId:currentData.deptId+'',
      });
    }
  }, [props.currentData]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const renderContent = () => {
    return (
      <>
        <FormItem name="id" label="主键" hidden>
          <Input id="update-id" placeholder="请输入主键" />
        </FormItem>
        <FormItem name="mobilePsw" label="新密码">
          <Input id="update-mobilePsw" placeholder={'请输入新密码'} />
        </FormItem>
        <FormItem name="rePwd" label="确认密码">
          <Input id="update-rePwd" placeholder={'请输确认密码'} />
        </FormItem>
      </>
    );
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };

  return (
    <Modal
      forceRender
      destroyOnClose
      title="密码修改"
      visible={updatePasswordModalVisible}
      {...modalFooter}
    >
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateUserPasswordForm;
