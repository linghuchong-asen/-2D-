/*
 * @Description:防区状态和设备状态用websocket接收
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-15 10:33:48
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-16 19:12:47
 */

import { getGlobalVar } from "@/utils";

// 防区状态饼图
export interface DefenceValue {
  total_num: number;
  failre_num: number;
  bypass_num: number;
  not_working_num: number;
  alarming_num: number;
  working_num: number;
}
export const defenceValue = (param: DefenceValue): void => {
  const token = localStorage.getItem("Authorization");
  let baseWs!: string;
  const instance = getGlobalVar();
  if (instance) baseWs = instance.$wsBaseUrl;
  if (token) {
    const defenceWs = new WebSocket(baseWs + "/ws/area/report/", [token]);
    defenceWs.onopen = () => {
      console.log("防区状态websocket链接成功");
    };
    defenceWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      param.total_num = data.total_num;
      param.failre_num = data.failre_num;
      param.bypass_num = data.bypass_num;
      param.not_working_num = data.not_working_num;
      param.alarming_num = data.alarming_num;
      param.working_num = data.working_num;
    };
    defenceWs.onclose = (event) => {
      console.log(event.reason);
    };
  }
};
