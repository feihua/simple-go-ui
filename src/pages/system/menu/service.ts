import { request } from 'umi';
import { MenuListParams, MenuListItem } from './data.d';

export async function queryMenuList(params?: MenuListParams) {
  return request('/api/menu/queryMenuList', {
    method: 'GET',
    data: {
      ...params,
    },
  });
}

export async function removeMenu(params: { id: number }) {
  return request('/api/menu/deleteMenu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addMenu(params: MenuListItem) {
  return request('/api/menu/addMenu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMenu(params: MenuListItem) {
  return request('/api/menu/updateMenu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
