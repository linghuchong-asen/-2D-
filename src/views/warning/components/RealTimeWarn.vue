<template>
  <li v-for="item in warnList" :key="item.targetId" class="warn">
    <div class="warnInfo">
      <div class="float">
        <span>告警防区:</span>
        <span>{{ item.warnRange }}</span>
      </div>
      <div class="float warnTime">
        <span>告警时长:</span>
        <span>{{ item.warnTime }}秒钟</span>
      </div>
      <div class="float checkbox">
        <el-checkbox v-model="trackShows" label="显示轨迹" size="large" />
        <el-checkbox v-model="targetTracking" label="目标跟踪" size="large" />
      </div>
    </div>
  </li>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
const warnList = reactive([
  { warnRange: "前门告警", warnTime: 10, targetId: "123" },
  { warnRange: "前门告警", warnTime: 10, targetId: "123" },
]);
const trackShows = ref(true);
const targetTracking = ref(false);
</script>
<style lang="less" scoped>
.float {
  float: left;
}
.warn {
  display: flex;
  width: 40%;
  padding-left: 0.3125rem;
  margin-bottom: 0.3125rem;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  border-radius: 0.3125rem;
  background: linear-gradient(135deg, #abdcff, #0396ff);

  .warnTime {
    margin-left: 0.5rem;
    margin-right: 0.3125rem;
  }

  .checkbox {
    /deep/ .el-checkbox--large {
      height: 100% !important;
      color: #fff;
    }
    /deep/ .is-checked .el-checkbox__label {
      color: #cc0250;
    }
  }
}
</style>
