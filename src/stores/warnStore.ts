import { defineStore } from "pinia";
import type { WarnHistoryData } from "@/views/layout/components/header/serverType";
import type { QueryForm } from "@/views/layout/components/header/components/warnQuery";

interface WarnStore {
  warningList: number[];
  historyWarn: WarnHistoryData;
  tabActive: string;
  historyQueryForm: QueryForm;
}

// 告警相关的状态
export const useWarnStore = defineStore({
  id: "warnStore",
  state: (): WarnStore => ({
    warningList: [], // 储存实时告警中的防区id
    historyWarn: [], // 历史告警查询结果
    tabActive: "realTimeWarn", // 当前显示的tab页
    historyQueryForm: {}, // 告警查询表单提交数据
  }),

  getters: {},
  actions: {
    // 重置表单
    resetHistoryQueryForm() {
      this.historyQueryForm = {};
    },
  },
});
