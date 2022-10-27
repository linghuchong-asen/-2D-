// 防区列表
export type DefenceNameList = { name: string; id: number }[];

// 防区分组
export type Group = { name: string; id: number }[];

// form绑定数据
export interface QueryData {
  group?: number; // 防区分组
  name?: number; // 防区列表（防区id）
  state?: number; // 告警状态（全部，已消音，待处置）
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
  erasureState?: number; // 消音状态
}

// form提交数据
export interface QueryForm {
  startdatetime?: string;
  enddatetime?: string;
  devtype?: string; // 设备类型
  alarmarea_name?: number; // 防区id
  erasurestate?: number; // 消音状态
  areanogroup?: number; // 防区分组id
  cfmstate?: number; // 处置状态
  page?: number; // 当前页
  page_size?: number; // 每页条数
  erasurestate?: number; // 消音状态
}
