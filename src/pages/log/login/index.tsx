import { Button, Card, Col, message, Modal, Row, Statistic } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { StatisticsLoginLog } from './data.d';
import { queryLoginLog, removeLoginLog, statisticsLoginLog } from './service';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeLoginLog({
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

const LoginLogList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [statisticsLoginLogData, setStatisticsLoginLogData] = useState<StatisticsLoginLog>();

  const showDeleteConfirm = (item: TableListItem) => {
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'loginTime',
      sorter: true,
      hideInSearch: true,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
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

  useEffect(() => {
    statisticsLoginLog().then((res) => {
      if (res.code === 0) {
        setStatisticsLoginLogData({
          dayLoginCount: res.data.dayLoginCount,
          monthLoginCount: res.data.monthLoginCount,
          weekLoginCount: res.data.weekLoginCount,
        });
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  return (
    <PageContainer title={false}>
      <Row gutter={8}>
        <Col span={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title="当天用户登录数"
              value={statisticsLoginLogData?.dayLoginCount}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title="当周用户登录数"
              value={statisticsLoginLogData?.weekLoginCount}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title="当月用户登录数"
              value={statisticsLoginLogData?.monthLoginCount}
              valueStyle={{ color: 'blue' }}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24}>
          <ProTable<TableListItem>
            headerTitle="登录日志列表"
            actionRef={actionRef}
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            request={queryLoginLog}
            columns={columns}
            rowSelection={{
              onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            }}
            pagination={{ pageSize: 10 }}
          />
        </Col>
      </Row>

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
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
    </PageContainer>
  );
};

export default LoginLogList;
