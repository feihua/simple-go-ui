import { request } from 'umi';
import type { TableListParams } from './data.d';

export async function querySysLog(params: TableListParams) {
  return request('/api/sysLog/queryOperateLogList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeSysLog(params: { ids: number[] }) {
  return request('/api/sysLog/deleteOperateLogByIds', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
