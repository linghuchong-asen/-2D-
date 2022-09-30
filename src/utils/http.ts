/*
 * @Description:http基于axios封装；没有在封装过程中使用try catch，因为一旦使用catch语句http函数返回类型就会编程unknown，在调用http函数时注意使用try catch语句
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-01 16:40:01
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-28 09:11:43
 */
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const http = async <T>(
  url: string,
  { params, ...props }: AxiosRequestConfig = {} // 赋一个初始值的方式，可以实现可选属性的效果
) => {
  props.headers = {};
  const token: string | null = window.localStorage.getItem("Authorization");
  if (token) {
    props.headers.Authorization = "Bearer " + token;
  }
  // 默认get请求，非get请求要传method值
  const config: AxiosRequestConfig = {
    method: "get",
    baseURL: "/bapi",
    ...props,
  };
  const doHttp = axios.create(config);

  // 响应拦截
  doHttp.interceptors.response.use(
    async (response) => {
      // 处理响应成功的结果，也就是http状态码是2xx系列的
      return response;
    },
    async (error) => {
      // 处理响应失败的情况，这里才可以拿到http状态码非2xx系列的包

      // token过期，利用refresh刷新token
      if (error.response.status === 403) {
        const refresh = window.localStorage.getItem("refresh");

        const newToken = await doHttp({
          method: "post",
          url: "/bapi/API/V0.1/Account/token/refresh/",
          data: {
            refresh,
          },
        });
        const access: string = newToken.data.access;
        window.localStorage.setItem("Authorization", access);
        /* 重新发起之前失败的请求 */
        // response.config是之前请求的请求配置
        const config = error.response.config;
        // 重新配置token
        if (config.headers !== undefined) config.headers.Authorization = access;
        // config.url已经带上了baseurl，所以这里要去除掉baseurl
        config.baseURL = "";

        const dataT = await doHttp(config);
        const { data, status }: { data: T; status: number } = dataT;
        return { data, status };
      }
      // 非401情况，直接返回（在有if的情况，不要忘记其他情况的return）
      return error.response;
    }
  );

  if (config.method !== "get" && config.method !== "delete") {
    // post put请求
    const dataT = await doHttp({ url, data: params });
    const { data, status }: { data: T; status: number } = dataT;
    return { data, status };
  } else {
    // get delete请求
    const p = params ? { url, params } : { url };
    const dataT = await doHttp(p);
    const { data, status }: { data: T; status: number } = dataT;
    return { data, status };
  }
};
