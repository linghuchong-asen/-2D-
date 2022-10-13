/*
 * @Description:头部涉及到的http请求
 * @Author: yangsen
 * @Date: 2022-09-29 13:25:57
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-11 21:08:26
 */

import { http } from "@/utils/http";

/* -----------------查询防区分组------------------------------- */
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
  alarmarea_group_name: string; // 防区分组名称
  bypass_end: null | string;
  bypass_start: null | string;
  counttime: number;
  delay: number;
  delaytime: number;
  delaytype: number;
  dev: string;
  devgroup: number[];
  devgroupobj: { id: number; name: string }[];
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
  linkarea: string;
  linkcamera: { id: number; preset: string }[];
  linktype: number;
  logictype: number;
  name: string;
  no: string;
  planned: null | number;
  region: number;
  shape: Shape;
  touch_eventflag: number;
  tracecamera: number[];
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
    endtime: string; // 结束时间
    planned: number; // 计划的id
  }[];
  name: string;
}

export const getDefencePlan = (param: string) =>
  http<DefencePlan | { detail: string }>(`API/V0.1/Area/Planned/${param}/`);

/* ------------获取指定防区-------------- */
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
export const getAssignDefence = (defenceId: string) =>
  http<AssignDefence | { detail: string }>(
    `/API/V0.1/Area/AlarmArea/${defenceId}/`
  );

/* ----------获取指定摄像机---------------- */
export interface AssignCamera {
  camera_pwd: string;
  camera_uname: string;
  channel: string;
  element: number;
  factory: string;
  from_nvr: null;
  from_nvr_channel: string;
  height: number;
  horizonscope: number;
  id: number;
  ip: string;
  is_delete: boolean;
  lat: number;
  lon: number;
  max_pan: number;
  max_tilt: number;
  max_zoom: number;
  memo: string;
  min_tilt: number;
  name: string;
  north_angle: number;
  offset_pan: number;
  offset_tilt: number;
  person_phone: string;
  person_uname: string;
  port: string;
  position_msg: string;
  region: number;
  rtsp_channel: string;
  rtsp_history_url: string;
  rtsp_port: string;
  rtsp_url: string;
  timestamp: string;
  type: number;
  vm_name: string;
  vm_no: string;
}
export const getAssignCamera = (cameraId: string) =>
  http<AssignCamera | { detail: string }>(
    `/API/V0.1/Onvif/BallheadCamera/${cameraId}/`
  );
