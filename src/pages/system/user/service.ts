import {request} from 'umi';
import {UpdatePasswordParams, UserListItem, UserListParams} from './data.d';

export async function queryUserList(params: UserListParams) {
  params.statusId = params.statusId ? Number(params.statusId) : 2;
  return request('/api/user/queryUserList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function querySelectAllData(params?: UserListParams) {
  return request('/api/user/selectAllData', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeUser(params: { ids: number[] }) {
  return request('/api/user/deleteUser', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addUser(params: UserListItem) {
  return request('/api/user/addUser', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUser(params: UserListItem) {
  return request('/api/user/updateUser', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updatePassword(params: UpdatePasswordParams) {
  return request('/api/user/updatePassword', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function userRoleList(params: { userId: number }) {
  return request('/api/user/queryUserRoleList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUserRole(params: { userId: number; roleIds: number[] }) {
  return request('/api/user/updateUserRoleList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
