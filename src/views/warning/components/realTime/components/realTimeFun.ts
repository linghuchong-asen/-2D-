/*
 * @Description:实时告警涉及到的方法
 * @Author: yangsen
 * @Date: 2022-09-27 17:46:27
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-13 17:58:58
 */

import { getAssignDefence, type AssignDefence } from "../../../server";
import { ElMessage } from "element-plus";

// 单击实时告警事件
export const clickEvent = async (defenceAreaId: string) => {
  // 发送获取指定防区请求
  try {
    const defenceData = await getAssignDefence(defenceAreaId);
    const { data, status } = defenceData;
    if (status === 200) {
      const successData = data as AssignDefence;
      const { tracecamera: traceCamera, linkcamera: linkCamera } = successData;
      // 需要播放视频的摄像机数组
      const vidicon = traceCamera.concat(linkCamera);
      console.log(vidicon);
    } else {
      const errorData = data as { detail: string };
      ElMessage({
        type: "error",
        message: errorData.detail,
      });
    }
  } catch (error) {
    console.error("获取指定防区出错" + error);
  }
};
