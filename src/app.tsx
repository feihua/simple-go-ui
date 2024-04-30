import {
  MenuDataItem,
  PageLoading,
  SettingDrawer,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import { history, RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { tree } from '@/utils/utils';
import {
  AlertOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  FrownOutlined,
  GiftOutlined,
  HeartOutlined,
  SettingOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { RequestConfig } from '@@/plugin-request/request';
// @ts-ignore
import { RequestInterceptor, RequestOptionsInit, ResponseInterceptor } from 'umi-request';
import { notification } from 'antd';

const IconMap = {
  SmileOutlined: <SmileOutlined />,
  HeartOutlined: <HeartOutlined />,
  SettingOutlined: <SettingOutlined />,
  DeleteOutlined: <DeleteOutlined />,
  FrownOutlined: <FrownOutlined />,
  GiftOutlined: <GiftOutlined />,
  DollarCircleOutlined: <DollarCircleOutlined />,
  AlertOutlined: <AlertOutlined />,
};

const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      // @ts-ignore
      localStorage.setItem('menuTree', JSON.stringify(msg.data.menus));
      // @ts-ignore
      localStorage.setItem('btnUrl', JSON.stringify(msg.data.apiUrls));
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
  menus.map(({ icon, children, ...item }) => {
    return {
      ...item,
      icon: icon && IconMap[icon as string],
      children: children && loopMenuItem(children),
    };
  });

const menuDataRender: any = () => {
  const item = localStorage.getItem('menuTree') + '';

  return loopMenuItem(tree(JSON.parse(item), 0, 'parentId'));

  // return tree(JSON.parse(item), 0, "parent_id");
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    menuDataRender: () => menuDataRender(),
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// 请求拦截
const addToken: RequestInterceptor = (url: string, options: RequestOptionsInit) => {
  const { method, data } = options;
  console.log('请求地址：' + method + ': ' + url);
  console.log('请求参数：' + JSON.stringify(data));

  options.headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };
  return {
    url,
    options,
  };
};

// 响应拦截
const res: ResponseInterceptor = async (response: Response) => {
  console.log('响应数据: ' + JSON.stringify(await response.clone().json()));
  return response;
};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [addToken],
  responseInterceptors: [res],
};
