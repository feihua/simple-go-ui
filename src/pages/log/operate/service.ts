import { request } from 'umi';
import type { TableListParams } from './data.d';

export async function querySysLog(params: TableListParams) {
  return request('/api/log/operate/queryOperateLogList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeSysLog(params: { ids: number[] }) {
  return request('/api/log/operate/deleteOperateLog', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
