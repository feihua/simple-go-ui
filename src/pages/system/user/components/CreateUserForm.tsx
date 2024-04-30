import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { UserListItem } from '../data.d';

export interface CreateFormProps {
  onCancel: () => void;
  onSubmit: (values: UserListItem) => void;
  createModalVisible: boolean;
}
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateUserForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();

  const { onSubmit, onCancel, createModalVisible } = props;

  useEffect(() => {
    if (form && !createModalVisible) {
      form.resetFields();
    }
  }, [props.createModalVisible]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: UserListItem) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="userName"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input id="create-name" placeholder={'请输入用户名'} />
        </FormItem>
        <FormItem
          name="mobile"
          label="手机号"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input id="create-mobile" placeholder={'请输入手机号'} />
        </FormItem>
        <FormItem
          name="statusId"
          label="状态"
          initialValue={1}
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Radio.Group id="statusId">
            <Radio value={0}>禁用</Radio>
            <Radio value={1}>启用</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          name="sort"
          label="排序"
          initialValue={1}
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber id="create-sort" style={{ width: 255 }} />
        </FormItem>
        <FormItem name="remark" label="备注">
          <Input.TextArea id="create-remark" placeholder={'请输入备注'} rows={4} />
        </FormItem>
      </>
    );
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };

  return (
    <Modal forceRender destroyOnClose title="新建用户" open={createModalVisible} {...modalFooter}>
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateUserForm;
