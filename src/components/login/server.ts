/*
 * @Description: 登录功能后端请求
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-06 08:51:52
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-15 11:45:14
 */
import { http } from "@/utils/http";

// 登录请求传参类型
export interface LoginParams {
  username: string;
  password: string;
}
// 登录后端返回数据结构
export interface LoginData {
  refresh: string;
  access: string;
}

/* 发送登录请求 */
export const loginHttp = (params: LoginParams) =>
  http<LoginData | { detail: string }>("/API/V0.1/Account/token/", {
    method: "post",
    params,
  });
