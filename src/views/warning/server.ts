/*
 * @Description: 告警用到的请求
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-08 21:19:02
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-28 09:51:13
 */
import { getGlobalVar } from "@/utils/index";
import { http } from "@/utils/http";
import type { RTData } from "./components/realTime/realTime";

// 实时报警websocket连接
export const createRealTimeAlarmWs = (param: RTData) => {
  const token = localStorage.getItem("Authorization");
  let baseWs!: string;
  const instance = getGlobalVar();
  if (instance) baseWs = instance.$wsBaseUrl;

  if (token) {
    // 雷达目标告警
    const targetWs = new WebSocket(baseWs + "/trgt/alarm/trgtalarm/", [token]);
    targetWs.onopen = () => {
      console.log("目标告警ws链接成功");
    };
    targetWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      Object.assign(param, data);
    };
    targetWs.onclose = (event) => {
      console.log(event.reason);
    };
  }
};

// IO报警websocket连接
export const createIOAlarmWs = (param: RTData) => {
  const token = localStorage.getItem("Authorization");
  let baseWs!: string;
  const instance = getGlobalVar();
  if (instance) baseWs = instance.$wsBaseUrl;

  if (token) {
    const targetWs = new WebSocket(baseWs + "/ws/IOSwitchAlarm/alarm/", [
      token,
    ]);
    targetWs.onopen = () => {
      console.log("IO设备告警ws链接成功");
    };
    targetWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      Object.assign(param, data);
    };
    targetWs.onclose = (event) => {
      console.log(event.reason);
    };
  }
};

// 获取指定防区
export interface AssignDefence {
  alarmarea_group: null;
  alarmarea_group_name: string;
  bypass_end: null;
  bypass_start: null;
  counttime: number;
  delay: number;
  delaytime: number;
  delaytype: number;
  devgroup: string[];
  devgroupobj: string[];
  devid: number;
  devname: string;
  devtype: number;
  event_flag: number;
  func_state: number;
  height: number;
  id: number;
  intervaltime: number;
  is_bypass: boolean;
  is_cover: boolean;
  is_delete: boolean;
  is_failure: boolean;
  is_multitype: boolean;
  is_working: boolean;
  linkarea: null;
  linkcamera: string[];
  linktype: number;
  logictype: number;
  name: string;
  no: string;
  planned: null;
  planned_name: string;
  region: number;
  shape: Shape;
  touch_eventflag: number;
  tracecamera: string[];
  type: number;
}

export interface Shape {
  coordinates: Array<Array<number[]>>;
  type: string;
}
export const getAssignDefence = (param: string) =>
  http<AssignDefence | { detail: string }>(
    `/API/V0.1/Area/AlarmArea/${param}/`
  );
