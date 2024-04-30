import { request } from 'umi';
import type { TableListParams } from './data.d';

/**
 * 查询登录日志
 * @param params
 */
export async function queryLoginLog(params: TableListParams) {
  return request('/api/log/login/queryLoginLogList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 批量删除登录日志
 * @param params
 */
export async function removeLoginLog(params: { ids: number[] }) {
  return request('/api/log/login/deleteLoginLog', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 查询日志统计
 */
export async function statisticsLoginLog() {
  return request('/api/log/login/statisticsLoginLog', {
    method: 'GET',
  });
}
