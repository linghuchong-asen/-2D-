<template>
  <div class="warnBox">
    <el-tabs v-model="warnStore.tabActive" :stretch="true">
      <el-tab-pane label="实时告警" name="realTimeWarn">
        <div class="realTimeInfo">
          <RealTimeWarn></RealTimeWarn>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史告警" name="historyWarn">
        <HistoryWarn></HistoryWarn>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import RealTimeWarn from "./components/realTime/RealTimeWarn.vue";
import HistoryWarn from "./components/history/HistoryWarn.vue";
import { useWarnStore } from "@/stores/warnStore";

const warnStore = useWarnStore();
</script>
<style scoped lang="less">
.warnBox {
  height: 100%;
  padding-left: 0.3125rem;
  padding-right: 0.3125rem;
  background-color: #106898;

  ::v-deep .el-tabs {
    height: 100%;
  }
  ::v-deep .el-tabs .el-tabs__header {
    height: 19%;
  }
  ::v-deep .el-tabs .el-tabs__content {
    height: 72%;
    overflow-y: auto;
  }
  .realTimeInfo {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  /deep/ .el-tabs__item {
    font-weight: 800;
    color: aliceblue;
  }
  /deep/.el-tabs .is-active {
    color: #81ecec;
  }
}
</style>
