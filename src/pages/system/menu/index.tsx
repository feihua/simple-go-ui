import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Divider, Drawer, Input, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateMenuForm from './components/UpdateMenuForm';
import { MenuListItem } from './data.d';
import { addMenu, queryMenuList, removeMenu, updateMenu } from './service';
import { hasPm, tree } from '@/utils/utils';
import CreateMenuForm from '@/pages/system/menu/components/CreateMenuForm';

const { confirm } = Modal;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: MenuListItem) => {
  const hide = message.loading('正在添加');
  try {
    fields.menuType = Number(fields.menuType);
    fields.sort = Number(fields.sort);
    await addMenu({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: Partial<MenuListItem>) => {
  const hide = message.loading('正在更新');
  try {
    fields.menuType = Number(fields.menuType);
    fields.sort = Number(fields.sort);
    fields.statusId = Number(fields.statusId);
    await updateMenu(fields as MenuListItem);
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 *  删除节点(单个)
 * @param id
 */
const handleRemove = async (id: number) => {
  const hide = message.loading('正在删除');
  try {
    await removeMenu({
      id,
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<MenuListItem>();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<MenuListItem>();

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: '是否删除记录?',
      icon: <ExclamationCircleOutlined />,
      content: '删除的记录不能恢复,请确认!',
      onOk() {
        handleRemove(id).then(() => {
          actionRef.current?.reloadAndRest?.();
        });
      },
      onCancel() {},
    });
  };

  const columns: ProColumns<MenuListItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '父id',
      dataIndex: 'parentId',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '路径',
      dataIndex: 'menuUrl',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '接口地址',
      dataIndex: 'apiUrl',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      hideInSearch: true,
      valueEnum: {
        1: { text: '目录', status: 'Success' },
        2: { text: '菜单', status: 'Error' },
        3: { text: '按钮', status: 'Success' },
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '图标',
      dataIndex: 'menuIcon',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'statusId',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            disabled={!hasPm('/api/menu/updateMenu')}
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={!hasPm('/api/menu/deleteMenuById')}
            onClick={() => {
              showDeleteConfirm(record.id);
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<MenuListItem>
        headerTitle="菜单列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            disabled={!hasPm('/api/menu/addMenu')}
            onClick={() => handleModalVisible(true)}
          >
            <PlusOutlined /> 新建菜单
          </Button>,
        ]}
        // @ts-ignore
        request={(params, sorter, filter) => queryMenuList({ ...params, sorter, filter })}
        columns={columns}
        postData={(data) => {
          const menus = data.map((x: any) => {
            if (!x.parentId) {
              x.parentId = 0;
            }
            return x;
          });
          return tree(menus, 0, 'parentId');
        }}
        pagination={false}
      />

      <CreateMenuForm
        key={'CreateMenuForm'}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            setStepFormValues(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
          setStepFormValues(undefined);
        }}
        createModalVisible={createModalVisible}
      />

      <UpdateMenuForm
        key={'UpdateMenuForm'}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setStepFormValues(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues(undefined);
        }}
        updateModalVisible={updateModalVisible}
        currentData={stepFormValues || {}}
      />

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.id && (
          <ProDescriptions<MenuListItem>
            column={2}
            title={row?.id}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.id,
            }}
            // @ts-ignore
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
