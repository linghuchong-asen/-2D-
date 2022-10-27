// 历史告警展示table绑定数据
export type TableData = {
  number: string; // 告警编号
  inputDevice: string; // 输入设备
  deviceName: string; // 设备名称
  defenceName: string; // 防区名称
  defenceId: number; // 防区id
  warnSate: string; // 告警状态
  operationUser: string; // 操作人
  operation: string; // 操作
  time: string; // 告警时间
  startTime: string;
  endTime: string;
}[];
