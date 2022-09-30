import { defineStore } from "pinia";

interface StateType {
  video: object;
}

/* 视频相关的全局状态 */
export const useVideoStore = defineStore({
  id: "video",
  state: (): StateType => ({
    video: {},
  }),

  getters: {},
  actions: {},
});
