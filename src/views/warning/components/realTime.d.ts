// 后端websocket推动的报警信息
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
