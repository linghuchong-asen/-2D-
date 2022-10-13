/*
 * @Description:防区状态和设备状态用websocket接收
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-15 10:33:48
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-12 09:37:48
 */

import type { BarValue } from "./components/device";
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
  const cloneObject = {};
  new SocketServer().connect(cloneObject, "/ws/area/report/");
  Object.assign(param, cloneObject);
};

// 设备状态
export const deviceValue = (param: BarValue) => {
  const cloneObject = {
    radarinfo: {
      total: 0,
      offline: 0,
    },
    videocamer: {
      total: 0,
      offline: 0,
    },
  };
  new SocketServer().connect(cloneObject, "/count/device/all/");
  Object.assign(param, {
    radarTotal: cloneObject.radarinfo.total,
    radarOffline: cloneObject.radarinfo.offline,
    videoTotal: cloneObject.videocamer.total,
    videoOffline: cloneObject.videocamer.offline,
  });
};

// 获取所有防区，用于判断配置服务是否正常
export const getAlarmArea = () => http("/API/V0.1/Area/AlarmArea/");
