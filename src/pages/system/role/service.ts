import {request} from 'umi';
import {RoleListParams, RoleListItem} from './data.d';

export async function queryRole(params: RoleListParams) {
  params.statusId = params.statusId ? Number(params.statusId) : 2;
  return request('/api/role/queryRoleList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryMenuByRoleId(roleId: number) {
  return request('/api/role/queryRoleMenuList?roleId=' + roleId, {
    method: 'GET',
  });
}

export async function updateRoleMenu(params: { roleId: number; menuIds: number[] }) {
  return request('/api/role/updateRoleMenuList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeRole(params: { ids: number[] }) {
  return request('/api/role/deleteRole', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRole(params: RoleListItem) {
  return request('/api/role/addRole', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRole(params: RoleListItem) {
  return request('/api/role/updateRole', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
