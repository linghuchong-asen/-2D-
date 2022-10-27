// 后端websocket推动的雷达目标报警信息
export interface WarnData {
  AlarmType: string;
  AlarmInfos: {
    trgt_id: string; // 目标id
    geometry: string; // 地理位置信息
    obj_id: string; //告警id
    alarmarea_id: number; // 防区id
    alarmarea_name: string; // 防区名称
    alarmarea_no: string; // 防区编号
    timestamp: string; // 触发时间
    devid: number; // 设备id
    devname: string; // 设备名称
    isprompt: false; // 是否是提示
    state: string; // 目标状态
    azi: number; // 角度
    dis: number; //距离
    vel: number; //速度
    is_link: boolean; //是否关联
    correlate: number; // 关联防区id
    bycorrelate: number; //被关联防区id
  }[];
}
export type RTData = WarnData | object;

// IO设备告警
export interface IOWarn {
  AlarmType: string;
  AlarmInfos: {
    name: string; // 设备名称
    attacktime: string; // 触发时间
    alarmarea_id: number; // 防区id
    devid: number; // 设备id
    alarmarea_name: string; // 防区名称
    status: string; // 火情或者告警
    obj_id: string; // 告警id
    is_link: boolean; // 是否关联产生
    correlate: number; // 关联防区
    bycorrelate: number; // 被关联防区
    isprompt: boolean; // 是否是提示
  };
}

// 雷达目标告警，展示用的数据源
export interface RadarWarnList {
  isRadar: boolean; // 是否为雷达目标告警
  warnRange: string; // 防区名称
  warnTimeLong: number; // 告警读秒时间，用于页面显示
  alarmId: string; // 告警id
  secondsIncreaseFlag: boolean; // 是否增加读秒标识
  lastTime: number; // 最后推送时间，用于5秒未推送删除
  defenceAreaId: number; // 防区id
  attackTime: string; // 触发时间
  alarmType: number; // 0 雷达告警 1海防  2.io告警
}

// IO设备告警，展示用的数据源
export interface IOWarnList {
  isRadar: boolean; // 是否为雷达目标告警
  warnRange: string; // 防区名称
  alarmId: string; // 告警id
  defenceAreaId: number; // 防区id
  attackTime: string; // 触发时间
  alarmType: number; // 0 雷达告警 1海防  2.io告警
}

// 告警处置表单
export interface HandleWarnData {
  cfmtype: string; // 处置类型 忽略/人工处置
  cfmdesc: string; // 处置描述
  type: number; //  处置方式 1：消音 2:消警
  cfmtime: string; // 处置时间
  alarmtype: string; // 告警类型 0 雷达告警 1海防  2.io告警
  obj_id: string; // 告警编号
  area: number; // 防区id
}
