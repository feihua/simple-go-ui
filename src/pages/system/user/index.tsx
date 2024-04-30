import {
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Divider, message, Drawer, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateUserForm from './components/CreateUserForm';
import UpdateUserForm from './components/UpdateUserForm';
import UpdateUserPasswordForm from './components/UpdateUserPasswordForm';
import UpdateUserRoleForm from './components/UpdateUserRoleForm';

import { UpdatePasswordParams, UserListItem } from './data.d';
import {
  queryUserList,
  updateUser,
  addUser,
  removeUser,
  updatePassword,
  updateUserRole,
} from './service';
import { hasPm } from '@/utils/utils';

const { confirm } = Modal;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: UserListItem) => {
  const hide = message.loading('正在添加');
  try {
    fields.sort = Number(fields.sort);
    await addUser({ ...fields });
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
const handleUpdate = async (fields: Partial<UserListItem>) => {
  const hide = message.loading('正在更新');
  try {
    fields.sort = Number(fields.sort);
    await updateUser(fields as UserListItem);
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
 * 更新节点
 * @param fields
 */
const handleUpdatePassword = async (fields: Partial<UpdatePasswordParams>) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updatePassword(fields as UpdatePasswordParams);
    hide();
    if (resp.code != 200) {
      message.error(resp.msg);
      return false;
    } else {
      message.success('更新成功');
      return true;
    }
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: UserListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeUser({
      ids: selectedRows.map((row) => row.id),
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
  const [updateRoleModalVisible, handleRoleModalVisible] = useState<boolean>(false);
  const [updatePasswordModalVisible, handlePasswordModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<UserListItem[]>([]);

  const showDeleteConfirm = (item: UserListItem) => {
    confirm({
      title: '是否删除记录?',
      icon: <ExclamationCircleOutlined />,
      content: '删除的记录不能恢复,请确认!',
      onOk() {
        handleRemove([item]).then(() => {
          actionRef.current?.reloadAndRest?.();
        });
      },
      onCancel() {},
    });
  };

  const columns: ProColumns<UserListItem>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '昵称',
      dataIndex: 'userName',
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'statusId',
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '正常', status: 'Success' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 400,
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            disabled={!hasPm('/api/user/updateUser')}
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
            icon={<EditOutlined />}
            disabled={!hasPm('/api/user/updateUserRoleList')}
            onClick={() => {
              handleRoleModalVisible(true);
              setStepFormValues(record);
            }}
          >
            设置角色
          </Button>
          {/*<Divider type="vertical"/>*/}
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  size="small"*/}
          {/*  disabled={!hasPm("/api/user/password")}*/}
          {/*  onClick={() => {*/}
          {/*    handlePasswordModalVisible(true);*/}
          {/*    setStepFormValues(record);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  密码修改*/}
          {/*</Button>*/}
          <Divider type="vertical" />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={!hasPm('/api/user/deleteUser')}
            onClick={() => {
              showDeleteConfirm(record);
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
      <ProTable<UserListItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            disabled={!hasPm('/api/user/addUser')}
            onClick={() => handleModalVisible(true)}
          >
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        // @ts-ignore
        request={(params, sorter, filter) => queryUserList({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{ pageSize: 10 }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <CreateUserForm
        key={'CreateUserForm'}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            setStepFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
          setStepFormValues({});
        }}
        createModalVisible={createModalVisible}
      />

      <UpdateUserForm
        key={'UpdateUserForm'}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setStepFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        updateModalVisible={updateModalVisible}
        currentData={stepFormValues}
      />

      <UpdateUserRoleForm
        key={'UpdateUserRoleForm'}
        onSubmit={async (value) => {
          const hide = message.loading('正在分配角色');
          const success = await updateUserRole(value);
          if (success) {
            hide();
            message.success('分配角色成功，即将刷新');
            handleRoleModalVisible(false);
            setStepFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            hide();
            message.error('分配角色失败，请重试');
          }
        }}
        onCancel={() => {
          handleRoleModalVisible(false);
          setStepFormValues({});
        }}
        updateRoleModalVisible={updateRoleModalVisible}
        currentData={stepFormValues}
      />

      <UpdateUserPasswordForm
        key={'UpdateUserPasswordForm'}
        onSubmit={async (value) => {
          const success = await handleUpdatePassword(value);
          if (success) {
            handlePasswordModalVisible(false);
            setStepFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handlePasswordModalVisible(false);
          setStepFormValues({});
        }}
        updatePasswordModalVisible={updatePasswordModalVisible}
        currentData={stepFormValues}
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
          <ProDescriptions<UserListItem>
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
