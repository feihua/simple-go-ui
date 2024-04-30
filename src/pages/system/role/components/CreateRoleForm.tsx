import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { RoleListItem } from '../data.d';

export interface CreateFormProps {
  onCancel: () => void;
  onSubmit: (values: RoleListItem) => void;
  createModalVisible: boolean;
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateRoleForm: React.FC<CreateFormProps> = (props) => {
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

  const handleFinish = (values: RoleListItem) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const renderContent = () => {
    return (
      <>
        <FormItem name="roleName" label="名称" rules={[{ required: true, message: '请输入排序' }]}>
          <Input id="add-roleName" placeholder={'请输入角色名称'} />
        </FormItem>
        <FormItem
          name="sort"
          label="排序"
          initialValue={1}
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber id="create-sort" style={{ width: 255 }} />
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
        <FormItem name="remark" label="备注">
          <Input.TextArea id="add-remark" placeholder={'请输入备注'} rows={4} />
        </FormItem>
      </>
    );
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };

  return (
    <Modal
      forceRender
      destroyOnClose
      title="新建角色"
      visible={createModalVisible}
      {...modalFooter}
    >
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateRoleForm;
