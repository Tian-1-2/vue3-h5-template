import Axios from "axios";
import NProgress from "../progress";
// import { showFailToast } from "vant";
import "vant/es/toast/style";
import { getToken } from '@/utils/auth'
// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  },
  timeout: 20000,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {}
};

class Http {
  constructor(config) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  // 当前实例
  static axiosInstance;
  // 请求配置
  static axiosConfigDefault;

  // 请求拦截
  httpInterceptorsRequest() {
    Http.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start();
        // 发送请求前，可在此携带 token
        // if (token) {
        //   config.headers['token'] = token
        // }
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false
        if (getToken() && !isToken) {
          config.headers['token'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        // get请求映射params参数 不用再拼接
        if (config.method === 'get' && config.params) {
          let url = config.url + '?' + tansParams(config.params);
          url = url.slice(0, -1);
          config.params = {};
          config.url = url;
        }
        if (config.method === 'post' || config.method === 'put') {
          const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
          }
          // const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
          // const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
          // if (requestSize >= limitSize) {
          //   console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
          //   return config;
          // }
          //点击快速提交增加提示
          const sessionObj = cache.session.getJSON('sessionObj')
          if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            cache.session.setJSON('sessionObj', requestObj)
          } else {
            const s_url = sessionObj.url;                // 请求地址
            const s_data = sessionObj.data;              // 请求数据
            const s_time = sessionObj.time;              // 请求时间
            const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
            if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
              const message = '数据正在处理，请勿重复提交';
              console.warn(`[${s_url}]: ` + message)
              return Promise.reject(new Error(message))
            } else {
              cache.session.setJSON('sessionObj', requestObj)
            }
          }
        }
        return config;
      },
      error => {
        showFailToast(error.message);
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  httpInterceptorsResponse() {
    Http.axiosInstance.interceptors.response.use(
      response => {
        NProgress.done();
        // 与后端协定的返回字段
        const { data, meta } = response.data;
        // 判断请求是否成功 （code 200 请求成功）
        const isSuccess =
          data && meta.success === true && meta.retCode === "0";
        if (isSuccess) {
          return data;
        } else {
          // 处理请求错误
          // showFailToast(message);
          showFailToast(meta.message);
          console.log(meta.message);
          return Promise.reject(response.data);
        }
      },
      error => {
        NProgress.done();
        // 处理 HTTP 网络错误
        let message = "";
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
          case 400:
            message = "请求错误";
            break;
          case 401:
            message = "未授权，请登录";
            break;
          case 403:
            message = "拒绝访问";
            break;
          case 404:
            message = `请求地址出错: ${error.response?.config?.url}`;
            break;
          case 408:
            message = "请求超时";
            break;
          case 500:
            message = "服务器内部错误";
            break;
          case 501:
            message = "服务未实现";
            break;
          case 502:
            message = "网关错误";
            break;
          case 503:
            message = "服务不可用";
            break;
          case 504:
            message = "网关超时";
            break;
          case 505:
            message = "HTTP版本不受支持";
            break;
          default:
            message = "网络连接故障";
        }

        showFailToast(message);
        return Promise.reject(error);
      }
    );
  }

  // 通用请求函数
  request(paramConfig) {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export const http = new Http(configDefault);
