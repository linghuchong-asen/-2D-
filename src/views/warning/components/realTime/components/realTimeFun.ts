/*
 * @Description:实时告警涉及到的方法
 * @Author: yangsen
 * @Date: 2022-09-27 17:46:27
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-20 09:44:24
 */

import { getAssignDefence, type AssignDefence } from "../../../server";
import { ElMessage } from "element-plus";
import { useVideoStore } from "@/stores/videoStore";

// 单击实时告警事件
export const clickEvent = async (defenceAreaId: number) => {
  // 获取视频对象
  const video = useVideoStore();

  // 发送获取指定防区请求
  try {
    const defenceData = await getAssignDefence(defenceAreaId);
    const { data, status } = defenceData;
    if (status === 200) {
      const successData = data as AssignDefence;
      const { tracecamera: traceCamera, linkcamera: linkCamera } = successData;
      // 需要播放视频的摄像机数组
      const vidicon = traceCamera.concat(linkCamera.map((item) => item.id));
      console.log(successData);
      console.log(vidicon);
      vidicon.forEach((item, index) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.log(item);
        video.video.play(index, item);
      });
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
