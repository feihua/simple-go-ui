import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { UserListItem } from '../data.d';

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: Partial<UserListItem>) => void;
  updateModalVisible: boolean;
  currentData: Partial<UserListItem>;
}
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateUserForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();

  const { onSubmit, onCancel, updateModalVisible, currentData } = props;

  useEffect(() => {
    if (form && !updateModalVisible) {
      form.resetFields();
    }
  }, [props.updateModalVisible]);

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
        <FormItem name="statusId" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
          <Radio.Group id="statusId">
            <Radio value={0}>禁用</Radio>
            <Radio value={1}>启用</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem name="sort" label="排序" rules={[{ required: true, message: '请输入排序' }]}>
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
    <Modal forceRender destroyOnClose title="修改用户" open={updateModalVisible} {...modalFooter}>
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateUserForm;
