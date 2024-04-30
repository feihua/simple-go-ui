export interface MenuListItem {
  id: number;
  statusId?: number;
  sort?: number;
  parentId?: number;
  menuName: string;
  label?: string;
  menuURL?: string;
  menuIcon?: string;
  apiURL?: string;
  remark?: string;
  menuType?: number;
}

export interface MenuListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface MenuListData {
  list: MenuListItem[];
  pagination: Partial<MenuListPagination>;
}

export interface MenuListParams {
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
