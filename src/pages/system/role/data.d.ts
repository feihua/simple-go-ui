export interface RoleListItem {
  id: number;
  statusID: number;
  sort: number;
  roleName: string;
  remark: string;
}

export interface RoleListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface RoleListData {
  list: RoleListItem[];
  pagination: Partial<RoleListPagination>;
}

export interface RoleListParams {
  pageSize?: number;
  current?: number;
  currentPage?: number;
  statusId?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
