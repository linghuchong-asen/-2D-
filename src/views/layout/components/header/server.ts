/*
 * @Description:头部涉及到的http请求
 * @Author: yangsen
 * @Date: 2022-09-29 13:25:57
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-30 16:49:32
 */

import { http } from "@/utils/http";

// 获取防区分组
export interface DefenceGroup {
  alarmareas: string[];
  descr: string;
  id: number;
  name: string;
}

export const getDefenceGroup = () =>
  http<DefenceGroup[] | { detail: string }>("/API/V0.1/Area/AlarmAreaGroup/");

/* -------------表单查询防区------------------ */
export interface Defence {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  alarmarea_group: null;
  bypass_end: null | string;
  bypass_start: null | string;
  counttime: number;
  delay: number;
  delaytime: number;
  delaytype: number;
  dev: string;
  devgroup: string[];
  devgroupobj: string[];
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
  level: number;
  linkarea: null;
  linkcamera: string[];
  linktype: number;
  logictype: number;
  name: string;
  no: string;
  planned: null;
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

export interface DefenceParam {
  alarmarea_group__id?: number;
  name?: string;
  types?: number;
  is_working?: number;
  is_bypass?: number;
  page: number;
  page_size: string;
}
export const getDefence = (params: DefenceParam) =>
  http<Defence | { detail: string }>("/API/V0.1/Area/AlarmArea/", { params });

/* -------------获取指定防区计划------------------- */
export interface DefencePlan {
  id: string;
  planneds: {
    id: number; // 计划时间的id
    timetag: number; // 周几
    starttime: string; // 开始时间
    endtimne: string; // 结束时间
    planned: number; // 计划的id
  }[];
  name: string;
}

export const getDefencePlan = (param: string) =>
  http<DefencePlan | { detail: string }>(`API/V0.1/Area/Planned/${param}/`);
