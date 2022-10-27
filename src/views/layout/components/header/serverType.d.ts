import { OperationLogParams } from "./serverType.d";
import type { number } from "echarts";

/* -----------------查询防区分组------------------------------- */
export type DefenceGroup = {
  alarmareas: string[];
  descr: string;
  id: number;
  name: string;
}[];

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

/* ------------设置布撤防----------------- */
export interface ClothRemovalParams {
  id: number;
  /**
   * 是否覆盖(0.不覆盖布防状态 1.覆盖布防状态)
   */
  is_cover: boolean;
  /**
   * 1、布防 2、撤防
   */
  is_working: boolean;
  /**
   * 密码
   */
  password: string;
}

/* ------------设置旁路----------------- */
export interface ByPassParams {
  id: number; // 防区id
  /**
   * 旁路结束时间
   */
  bypassEnd: string;
  /**
   * 旁路开始时间
   */
  bypassStart: string;
  /**
   * 旁路
   */
  isBypass: boolean;
  /**
   * 操作密码
   */
  password: string;
}
/* --------获取所有防区---------- */
export type DefenceAll = {
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
  no: null;
  planned: null;
  region: number;
  shape: Shape;
  touch_eventflag: number;
  tracecamera: string[];
  type: number;
}[];

export interface Shape {
  coordinates: Array<Array<number[]>>;
  type: string;
}

/* ----------历史告警查询------------ */
export interface WarnHistoryParams {
  startdatetime?: string;
  enddatetime?: string;
  devtype?: string; // 设备类型
  alarmarea_name?: number; // 防区id
  erasurestate?: number; // 消音状态
  areanogroup?: number; // 防区分组id
  cfmstate?: number; // 处置状态
  page?: number; // 当前页
  page_size?: number; // 每页条数
}

export type WarnHistoryData = {
  id: number;
  cfmstate: number; // 处置状态 0:待处置 1:已处置
  cfmtime: null;
  cfmdesc: string;
  erasurestate: number; // 消音状态
  alarmarea_name: string; // 防区名称
  obj_id: string; // 告警编号
  devtype: number; // 输入设备（设备类型  0.微波雷达 1.海防雷达 2.IO设备）
  devid: number;
  devname: string; // 设备名称
  starttime: string; // 开始时间
  endtime: string; // 结束时间
  is_link: null;
  attribute: string;
  attribute_type: number;
  alarmarea: number; // 防区id
  correlate: null;
  bycorrelate: null;
}[];

/* -----------获取全部要素--------------------- */
interface FeatureBase {
  id: number;
  name: string;
  visible: boolean;
  elementtype: string;
  property_id: null;
  propertytype: number;
  minivisibledis: number;
  maxvisibledis: number;
  style: string;
  datasource: null;
  level: number;
  memo: string;
  is_delete: false;
  parent_id: null;
  region_id: number;
}
interface FeatureItem {
  id: number;
  name: string;
  visible: boolean;
  elementtype: string;
  property_id: null;
  propertytype: number;
  minivisibledis: number;
  maxvisibledis: number;
  style: string;
  datasource: null;
  level: number;
  memo: string;
  is_delete: false;
  parent_id: null;
  region_id: number;
  child?: FeatureBase[];
}
export type FeatureData = FeatureItem[];

/* -----------获取设备告警----------------------- */
type DeviceWarnResult = {
  id: number;
  alarmarea_name: string;
  alarmarea_no: string;
  devid: number;
  devname: string;
  is_online: boolean;
  devtype: number;
  timestamp: string;
  offlinetime: string;
  alarmarea: number;
}[];

export interface DeviceWarn {
  count: number;
  next: string;
  results: DeviceWarnResult;
}

export interface DeviceWarnParams {
  devtype?: number; // 设备分类 0.微波雷达 1.海防 2.IO设备
  devname?: string; // 设备名称
  areaname?: string; // 防区名称
  is_online?: number; // 设备状态 0离线 1在线
  startdatetime?: string;
  enddatetime?: string;
  page: number;
  page_size: number;
}

/* ------------获取操作记录---------------------- */
export interface OperationLogParams {
  startdatetime?: [string, string];
  operation_category?: string; // 操作类型
  username?: string; // 用户名
  page: number;
  page_size: number;
}
export type OperationLogResult = {
  id: number;
  username: string;
  target_id: null;
  target_name: null;
  operation_time: string; // 时间
  operation_category: string; // 操作类型
  operation_action: string;
  operation_desc: string; // 描述
  request_method: string;
  request_url: string;
  request_data: string; // 名称
  user: number; // 用户名
  region: number;
}[];
export interface OperationLogData {
  count: 4; // 记录数量
  next: null;
  previous: null;
  results: OperationLogResult;
}

/* -----------获取交接班信息----------- */
export interface RelieveParams {
  StartDateTime?: string;
  EndDateTime?: string;
  page: number;
  page_size: number;
}
export type RelieResult = {
  id: number;
  timestamp: string;
  region: null;
  to_username: string;
  from_username: string;
}[];
export interface RelieData {
  count: 4; // 记录数量
  next: null;
  previous: null;
  results: RelieResult;
}

/* --------------交接班----------------------- */
export interface SetRelieveParams {
  FromUsername: string;
  ToUsername: string;
  FromPassword: string;
  ToPassword: string;
}
export interface SetRelieveData {
  status: string;
  token: string;
}
