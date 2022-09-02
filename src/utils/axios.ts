import axios from "axios";
import type { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token: string | null = window.sessionStorage.getItem("token");
    const headers: AxiosRequestHeaders | undefined = config.headers;
    if (token) {
      if (headers) headers.Authorization = token;
    }
    // 必须return出去，否则配置不成功
    return config;
  },
  (erro) => {
    // 错误情况的处理
    console.log(erro);
  }
);
export { axios };
