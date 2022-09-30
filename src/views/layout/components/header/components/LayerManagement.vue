<!--
 * @Description: 图层管理
 * @Author: yangsen
 * @Date: 2022-09-22 20:48:05
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-28 11:10:54
-->
<template>
  <el-popover
    ref="popoverRef"
    :virtual-ref="fatherRef"
    trigger="click"
    title="With title"
    virtual-triggering
  >
    <span> Some content </span>
  </el-popover>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatherRef: any;
}>();
// defineExpose<>()
const popoverRef = ref();
</script>
<style lang="less" scoped></style>
