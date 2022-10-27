/*
 * @Description:防区状态和设备状态用websocket接收
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-15 10:33:48
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-19 15:46:38
 */

import type { BarSource } from "./components/device";
import { http } from "@/utils/http";
import { SocketServer } from "@/utils/websocket";

// 防区状态饼图
export interface DefenceValue {
  total_num: number;
  failre_num: number;
  bypass_num: number;
  not_working_num: number;
  alarming_num: number;
  working_num: number;
}
export const defenceValue = (param: DefenceValue): void => {
  new SocketServer().connect(param, "/ws/area/report/");
};

// 设备状态
export const deviceValue = (param: BarSource) => {
  new SocketServer().connect(param, "/count/device/all/");
};

// 获取所有防区，用于判断配置服务是否正常
export const getAlarmArea = () => http("/API/V0.1/Area/AlarmArea/");
