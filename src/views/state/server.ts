/*
 * @Description:防区状态和设备状态用websocket接收
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-15 10:33:48
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-23 11:33:58
 */

import { getGlobalVar } from "@/utils";
import type { BarValue } from "./components/device";
import { http } from "@/utils/http";

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
  const token = localStorage.getItem("Authorization");
  let baseWs!: string;
  const instance = getGlobalVar();
  if (instance) baseWs = instance.$wsBaseUrl;
  if (token) {
    const defenceWs = new WebSocket(baseWs + "/ws/area/report/", [token]);
    defenceWs.onopen = () => {
      console.log("防区状态ws链接成功");
    };
    defenceWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      Object.assign(param, data);
    };
    defenceWs.onclose = (event) => {
      console.log(event.reason);
    };
  }
};

// 设备状态
export const deviceValue = (param: BarValue) => {
  const token = localStorage.getItem("Authorization");
  let baseWs!: string;
  const instance = getGlobalVar();
  if (instance) baseWs = instance.$wsBaseUrl;
  if (token) {
    const deviceWs = new WebSocket(baseWs + "/count/device/all/", [token]);
    deviceWs.onopen = () => {
      console.log("设备状态ws链接成功");
    };
    deviceWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      Object.assign(param, {
        radarTotal: data.radarinfo.total,
        radarOffline: data.radarinfo.offline,
        videoTotal: data.videocamer.total,
        videoOffline: data.videocamer.offline,
      });
    };
    deviceWs.onclose = (event) => {
      console.log(event.reason);
    };
  }
};

// 获取所有防区，用于判断配置服务是否正常
export const getAlarmArea = () => http("/API/V0.1/Area/AlarmArea/");
