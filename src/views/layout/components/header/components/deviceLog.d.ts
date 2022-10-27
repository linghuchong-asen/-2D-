// 查询表单绑定数据
export interface DeviceQueryForm {
  class?: number; // 设备分类 0.微波雷达 1.海防 2.IO设备
  devName?: string; // 设备名称
  defenceName?: string; // 防区名称
  devState?: number; // 设备状态 0离线 1在线
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
}

// 表单发送数据
export interface DeviceQueryData {
  devtype?: number; // 设备分类 0.微波雷达 1.海防 2.IO设备
  devname?: string; // 设备名称
  areaname?: string; // 防区名称
  is_online?: number; // 设备状态 0离线 1在线
  startdatetime?: string;
  enddatetime?: string;
  page: number;
  page_size: number;
}

// 表单查询结果
export type Result = {
  id: number;
  alarmarea_name: string; // 防区名称
  alarmarea_no: string; // 防区编号
  devid: number; // 设备id
  devname: string; // 设备名称
  is_online: boolean; // 是否在线
  devtype: number; // 设备类型
  timestamp: string; //  触发时间
  offlinetime: string; // 掉线时间
  alarmarea: number; // 防区id
}[];
