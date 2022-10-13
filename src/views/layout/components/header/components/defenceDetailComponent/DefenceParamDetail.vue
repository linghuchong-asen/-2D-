<template>
  <div>
    <ul>
      <li class="paddingBottom">
        <label>防区名称: </label><span>{{ props.params.name }}</span>
      </li>
      <li class="paddingBottom">
        <label>防区分组: </label><span>{{ props.params.group }}</span>
      </li>
      <li class="paddingBottom">
        <label>输入设备: </label><span>{{ props.params.inputDevice }}</span>
      </li>
    </ul>
    <!-- 类型参数 -->
    <div class="paramType">
      <header class="paddingBottom">类型参数:</header>
      <div style="padding-left: 10px">
        <div v-if="props.params.type === 3" class="paddingBottom">
          <label>延时时间: </label><span>{{ props.params.delayTime }}秒</span>
        </div>
        <div v-if="props.params.type === 5" class="paddingBottom">
          <label>关联防区触发类型: </label
          ><span>{{ props.params.triggerType }}</span>
          <label>关联防区名称</label><span>{{ props.params.linkDefence }}</span>
        </div>
        <div v-else class="paddingBottom">无</div>
      </div>
    </div>
    <!-- 联动设备 -->
    <div class="linkDevice">
      <header class="paddingBottom">联动设备:</header>
      <div style="padding-left: 10px">
        <div class="paddingBottom">
          <label>联动相机: </label>
          <span v-if="traceCameraNumber === 0">无</span>
          <span
            v-else
            v-for="(item, index) in props.params.traceCamera"
            :key="index"
            >{{ item }}</span
          >
        </div>
        <div v-if="linkCameraNumber === 0" class="paddingBottom">
          <label>关联相机: </label>
          <span v-if="linkCameraNumber === 0">无</span>
          <span
            v-else
            v-for="(item, index) in props.params.linkCamera"
            :key="index"
            >{{ item }}</span
          >
        </div>
        <div class="paddingBottom">
          <label>关联设备: </label>
          <span v-if="linkDeviceNumber === 0">无</span>
          <span
            v-else
            v-for="(item, index) in props.params.linkDevice"
            :key="index"
            >{{ item }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import type { DefenceInfo } from "../defenceManagement";
const props = defineProps<{
  params: DefenceInfo;
}>();
const propsRef = toRefs(props);
const traceCameraNumber = propsRef.params.value.traceCamera.length;
const linkCameraNumber = propsRef.params.value.linkCamera.length;
const linkDeviceNumber = propsRef.params.value.linkDevice.length;
</script>
<style lang="less" scoped></style>
