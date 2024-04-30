import React, { useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Form, Input, InputNumber, message, Modal, Radio, TreeSelect } from 'antd';
import type { MenuListItem } from '../data.d';
import { queryMenuList } from '@/pages/system/menu/service';
import { tree } from '@/utils/utils';

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: MenuListItem) => void;
  updateModalVisible: boolean;
  currentData: Partial<MenuListItem>;
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateMenuForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [menuType, setMenuType] = useState<number>(1);
  const [treeData, setTreeData] = useState<MenuListItem[]>([]);

  const { onSubmit, onCancel, updateModalVisible, currentData } = props;

  useEffect(() => {
    if (form && !updateModalVisible) {
      form.resetFields();
    } else {
      queryMenuList({}).then((res) => {
        if (res.code === 1) {
          setTreeData(tree(res.data, 0, 'parentId'));
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [props.updateModalVisible]);

  useEffect(() => {
    if (currentData) {
      setMenuType(currentData.menuType || 1);
      form.setFieldsValue({
        ...currentData,
      });
    }
  }, [props.currentData]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: MenuListItem) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const onChange = (e: RadioChangeEvent) => {
    const t = e.target.value;
    setMenuType(t);
  };

  const renderContent = () => {
    function buildDirectory() {
      return (
        <>
          <FormItem
            label="目录名称"
            name="menuName"
            rules={[{ required: true, message: '请输入目录名称!' }]}
          >
            <Input placeholder={'请输入目录名称'} />
          </FormItem>

          <FormItem label="路径地址" name="menuUrl">
            <Input placeholder={'请输入路径'} />
          </FormItem>

          <FormItem
            label="目录图标"
            name="menuIcon"
            initialValue={'Setting'}
            rules={[{ required: true, message: '请输入图标!' }]}
          >
            <Input />
          </FormItem>
        </>
      );
    }

    function buildMenu() {
      return (
        <>
          <FormItem
            label="上级名称"
            name="parentId"
            rules={[{ required: true, message: '请选择上级菜单!' }]}
          >
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              placeholder="请选择上级"
              fieldNames={{ label: 'menuName', value: 'id', children: 'children' }}
              allowClear
            />
          </FormItem>

          <FormItem
            label="菜单名称"
            name="menuName"
            rules={[{ required: true, message: '请输入菜单名称!' }]}
          >
            <Input />
          </FormItem>

          <FormItem
            label="路径地址"
            name="menuUrl"
            rules={[{ required: true, message: '请输入路径!' }]}
          >
            <Input />
          </FormItem>
        </>
      );
    }

    function buildBtn() {
      return (
        <>
          <FormItem
            label="上级名称"
            name="parentId"
            rules={[{ required: true, message: '请选择上级菜单!' }]}
          >
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              placeholder="请选择上级"
              fieldNames={{ label: 'menuName', value: 'id', children: 'children' }}
              allowClear
            />
          </FormItem>

          <FormItem
            label="按钮名称"
            name="menuName"
            rules={[{ required: true, message: '请输入按钮名称!' }]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="接口地址"
            name="apiUrl"
            rules={[{ required: true, message: '请输入接口地址!' }]}
          >
            <Input />
          </FormItem>
        </>
      );
    }

    return (
      <>
        <FormItem name="id" label="主键" hidden>
          <Input id="update-id" />
        </FormItem>
        <FormItem label="类型" name="menuType" initialValue={1}>
          <Radio.Group onChange={onChange} disabled>
            <Radio value={1}>目录</Radio>
            <Radio value={2}>菜单</Radio>
            <Radio value={3}>按钮</Radio>
          </Radio.Group>
        </FormItem>
        {menuType === 1 && buildDirectory()}
        {menuType === 2 && buildMenu()}
        {menuType === 3 && buildBtn()}
        <FormItem
          label="排序"
          name="sort"
          initialValue={1}
          rules={[{ required: true, message: '请输入排序!' }]}
        >
          <InputNumber style={{ width: 255 }} />
        </FormItem>
        <FormItem
          label="状态"
          name="statusId"
          initialValue={1}
          rules={[{ required: true, message: '请选择状态!' }]}
        >
          <Radio.Group>
            <Radio value={1}>正常</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </FormItem>
      </>
    );
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };

  return (
    <Modal forceRender destroyOnClose title="修改菜单" open={updateModalVisible} {...modalFooter}>
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateMenuForm;
