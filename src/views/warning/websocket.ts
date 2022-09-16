/*
 * @Description: 创建websocket链接文件；接收各种告警信息
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-08 21:19:02
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-14 17:08:06
 */
import { getGlobalVar } from "@/utils/index";

export const createWs = () => {
  const token = localStorage.getItem("Authorization");
  let baseWs!: string;
  const instance = getGlobalVar();
  if (instance) baseWs = instance.$wsBaseUrl;

  if (token) {
    // 雷达目标告警
    const targetWs = new WebSocket(baseWs + "/trgt/alarm/trgtalarm/", [token]);
    targetWs.onopen = () => {
      console.log("目标告警ws链接成功");
    };
    targetWs.onmessage = (event) => {
      console.log(event.data);
    };
    targetWs.onclose = (event) => {
      console.log(event.reason);
    };
  }
};
