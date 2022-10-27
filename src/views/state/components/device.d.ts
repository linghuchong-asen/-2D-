/*
 * @Description: DeviceState.vue的声明文件
 * @Author: yangsen
 * @Date: 2022-09-21 14:46:41
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-19 15:34:34
 */
export interface BarValue {
  radarTotal: number;
  radarOffline: number;
  videoTotal: number;
  videoOffline: number;
}

export interface BarSource {
  radarinfo: {
    total: number;
    offline: number;
  };
  videocamer: {
    total: number;
    offline: number;
  };
}
