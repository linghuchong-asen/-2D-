/*
 * @Description:头部涉及到的http请求
 * @Author: yangsen
 * @Date: 2022-09-29 13:25:57
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-26 16:49:11
 */

import { http } from "@/utils/http";
import type {
  DefenceAll,
  DefenceGroup,
  Defence,
  DefenceParam,
  AssignDefence,
  AssignCamera,
  ClothRemovalParams,
  ByPassParams,
  WarnHistoryParams,
  WarnHistoryData,
  FeatureData,
  DeviceWarn,
  DeviceWarnParams,
  OperationLogParams,
  OperationLogData,
  RelieveParams,
  RelieData,
  SetRelieveParams,
  SetRelieveData,
} from "./serverType";

/* -----------------查询防区分组------------------------------- */

export const getDefenceGroup = () =>
  http<DefenceGroup | { detail: string }>("/API/V0.1/Area/AlarmAreaGroup/");

/* -------------表单查询防区------------------ */

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

export const getAssignDefence = (defenceId: string) =>
  http<AssignDefence | { detail: string }>(
    `/API/V0.1/Area/AlarmArea/${defenceId}/`
  );

/* ----------获取指定摄像机---------------- */

export const getAssignCamera = (cameraId: string) =>
  http<AssignCamera | { detail: string }>(
    `/API/V0.1/Onvif/BallheadCamera/${cameraId}/`
  );

/* ------------设置布撤防----------------- */

export const setClothRemoval = (params?: ClothRemovalParams) =>
  http(`/API/V0.1/Area/SetIsWorking/${params?.id}/`, {
    method: "post",
    params: {
      is_cover: params?.is_cover,
      is_working: params?.is_working,
      password: params?.password,
    },
  });

/* ------------设置旁路----------------- */

export const setByPass = (params: ByPassParams) =>
  http(`/API/V0.1/Area/SetBypass/${params.id}/`, {
    method: "post",
    params: {
      bypass_end: params.bypassEnd,
      bypass_start: params.bypassStart,
      is_bypass: params.isBypass,
      password: params.password,
    },
  });

/* ---------获取所有防区--------- */
export const getDefenceAll = () =>
  http<DefenceAll>("/API/V0.1/Area/AlarmArea/");

/* ----------历史告警查询----------- */
export const getWarnHistory = (params?: WarnHistoryParams) =>
  http<WarnHistoryData>("/API/V0.1/Area/AlarmInfo/", { params });

/* ----------获取全部要素------------- */
export const getAllFeature = () =>
  http<FeatureData>("/API/V0.1/JMSceneConfigService/GetElementThree/");

/* -----------获取设备告警------------------ */
export const getDeviceWarn = (params?: DeviceWarnParams) =>
  http<DeviceWarn>("/API/V0.1/Area/DevAlarm/", { params });

/* ------------获取操作记录---------------------- */
export const getOperationLog = (params?: OperationLogParams) =>
  http<OperationLogData>("/API/V0.1/LogRecord/OperationLog/", { params });

/* ------------获取交接班信息---------------- */
export const getRelieLog = (params?: RelieveParams) =>
  http<RelieData>("/API/V0.1/Account/ShiftRecords/", { params });

/* --------------交接班-------------------- */
export const setRelieve = (params?: SetRelieveParams) =>
  http<SetRelieveData>("/API/V0.1/Account/ShiftRecords/", {
    method: "post",
    params,
  });
