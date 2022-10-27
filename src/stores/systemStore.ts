import { defineStore } from "pinia";

interface SystemStore {
  videoSeconds: number; // 关联视频前秒数
  screenNum: number; // 分屏数量
  pollTime: number; // 告警视频轮询时长
  systemName: string; // 系统标题
  deleteWarn: number; // 自动删除告警时间
}

export const useSystemStore = defineStore({
  id: "systemStore",
  state: (): SystemStore => ({
    videoSeconds: 10,
    screenNum: 9,
    pollTime: 20,
    systemName: "周界2D版",
    deleteWarn: 5,
  }),
  getters: {},
  actions: {},
});
