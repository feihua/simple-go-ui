/**
 * 递归树
 * @param {*} data 文件名
 * @param {*} pid 父级id
 * @param key
 */
export function tree(data: any, pid = 0, key = 'pid') {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const i in data) {
    if (data[i][key] === pid) {
      const temp = data[i];
      const children = tree(data, data[i].id, key);
      if (children.length) {
        temp.children = children;
      }
      result.push(temp);
    }
  }

  return result;
}

// 只返回是否有权限（方法形式）
export const hasPm = (apiUrl: string) => {
  return JSON.parse(localStorage.getItem('btnUrl') || '[]').some((item: string) => {
    return item === apiUrl;
  });
};

// 判断有无按钮权限（组件形式）
export const HasPm = (props: { apiUrl: string; children: any }) => {
  const { apiUrl, children } = props;

  return hasPm(apiUrl) ? children : null;
};
