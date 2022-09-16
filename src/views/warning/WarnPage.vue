<template>
  <div class="warnBox">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
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
import RealTimeWarn from "./components/RealTimeWarn.vue";
import HistoryWarn from "./components/HistoryWarn.vue";
import { createWs } from "./websocket";
// 建立websocket链接
createWs();

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

  .realTimeInfo {
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
