<template>
  <div class="warnBox">
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="实时告警" name="first">
        <div class="realTimeInfo">
          <RealTimeWarn></RealTimeWarn>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史告警" name="second">
        <HistoryWarn></HistoryWarn>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import RealTimeWarn from "./components/realTime/RealTimeWarn.vue";
import HistoryWarn from "./components/history/HistoryWarn.vue";

const activeName = ref("first");
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
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
