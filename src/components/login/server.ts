/*
 * @Description: 登录功能后端请求
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-06 08:51:52
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-07 14:35:55
 */
import { http } from "@/utils/axios";

// 登录请求传参类型
export interface LoginParams {
  username: string;
  password: string;
}
// 登录后端返回数据结构
export interface LoginData {
  refresh: string;
  access: string;
  detail?: string;
}

/* 发送登录请求 */
export const loginHttp = (params: LoginParams) =>
  http<LoginData>("/API/V0.1/Account/token/", { method: "post", params });
