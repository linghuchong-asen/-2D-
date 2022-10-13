export interface DefenceInfo {
  name: string; // 防区名称
  group: string; // 分组名称
  type: number; // 防区类型
  inputDevice: string; // 输入设备
  delayTime?: number; // 延时时间
  triggerType?: string; // 关联防区用到的触发类型
  linkDefence?: string; // 关联防区名称
  linkCamera: string[]; // 联动相机
  traceCamera: string[]; // 关联相机
  linkDevice: string[]; // 联动设备
}
