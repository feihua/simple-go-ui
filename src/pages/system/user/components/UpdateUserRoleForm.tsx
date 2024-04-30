import { Modal, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { UserListItem } from '../data.d';
import { userRoleList } from '../service';

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: { userId: number; roleIds: number[] }) => void;
  updateRoleModalVisible: boolean;
  currentData: Partial<UserListItem>;
}

interface DataRole {
  id: number;
  statusId: number;
  sort: number;
  roleName: string;
  remark: string;
}

const columns: ColumnsType<DataRole> = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '排序排序',
    dataIndex: 'sort',
  },
  {
    title: '状态',
    dataIndex: 'statusId',
    render: (_, { statusId }) => (
      <>
        <Tag color={statusId === 1 ? 'green' : 'red'}>{statusId === 1 ? '启动' : '禁用'}</Tag>
      </>
    ),
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

const UpdateUserRoleForm: React.FC<UpdateFormProps> = (props) => {
  const [roleList, setRoleList] = useState<DataRole[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { onSubmit, onCancel, updateRoleModalVisible, currentData } = props;

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const data1 = {
        userId: currentData.id || 0,
        roleIds: selectedRowKeys.map((i) => Number(i)),
      };
      onSubmit(data1);
    }
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };

  useEffect(() => {
    if (updateRoleModalVisible) {
      setRoleList([]);
      setSelectedRowKeys([]);
      userRoleList({ userId: currentData.id || 0 }).then((res) => {
        console.log(res);
        setRoleList(res.data.allRoles);

        if (res.data.allUserRoleIds) {
          setSelectedRowKeys(res.data.allUserRoleIds);
        }
      });
    }
  }, [props.updateRoleModalVisible]);

  return (
    <Modal
      forceRender
      destroyOnClose
      title="设置角色"
      open={updateRoleModalVisible}
      width={1200}
      {...modalFooter}
    >
      <div>
        <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={roleList} />
      </div>
    </Modal>
  );
};

export default UpdateUserRoleForm;
