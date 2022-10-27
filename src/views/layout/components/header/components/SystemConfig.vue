<!--
 * @Description: 系统配置组件
 * @Author: yangsen
 * @Date: 2022-10-20 21:14:07
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-25 17:16:59
-->
<template>
  <el-form label-width="140px" style="max-width: 300px" :model="form">
    <el-form-item label="关联视频前秒数">
      <el-input-number v-model="form.videoSeconds" :min="1" :max="1000" />
    </el-form-item>
    <el-form-item label="默认分屏数量">
      <el-select v-model="form.screenNum" class="m-2" placeholder="Select">
        <el-option label="4分屏" :value="4" />
        <el-option label="9分屏" :value="9" />
      </el-select>
    </el-form-item>
    <el-form-item label="自动轮询时长">
      <el-input-number v-model="form.pollTime" :min="1" :max="1000" />
    </el-form-item>
    <el-form-item label="系统标题">
      <el-input v-model="form.systemName" placeholder="Please input" />
    </el-form-item>
    <el-form-item label="自动删除告警时长">
      <el-input-number v-model="form.deleteWarn" :min="1" :max="1000" />
    </el-form-item>
    <el-from-item>
      <el-button type="primary" @click="save">保存</el-button>
    </el-from-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useSystemStore } from "@/stores/systemStore";
import { ElMessage } from "element-plus";

const systemStore = useSystemStore();

const emit = defineEmits<{
  (e: "visible"): void;
}>();

// form绑定数据
const form = reactive<{
  videoSeconds: number; // 关联视频前秒数
  screenNum: number; // 分屏数量
  pollTime: number; // 告警视频轮询时长
  systemName: string; // 系统标题
  deleteWarn: number; // 自动删除告警时间
}>({
  videoSeconds: systemStore.videoSeconds,
  screenNum: systemStore.screenNum,
  pollTime: systemStore.pollTime,
  systemName: systemStore.systemName,
  deleteWarn: systemStore.deleteWarn,
});

// 点击保存事件
const save = () => {
  systemStore.$patch({
    videoSeconds: form.videoSeconds,
    screenNum: form.screenNum,
    pollTime: form.pollTime,
    systemName: form.systemName,
    deleteWarn: form.deleteWarn,
  });

  emit("visible");

  ElMessage({ type: "success", message: "配置完成" });
};
</script>
<style lang="less" scoped></style>
