<!--
 * @Description: 阿里图标库公共组件
 * @Author: yangsen
 * @Date: 2022-09-28 15:31:26
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-28 16:19:54
-->
<template>
  <svg class="icon" aria-hidden="true">
    <use v-bind:xlink:href="iconName"></use>
  </svg>
</template>

<script lang="ts" setup>
import { toRefs, computed } from "vue";
import "./iconfont.js";
const props = defineProps<{
  name: string;
  color?: string;
  fontSize?: string;
}>();
const propsRef = toRefs(props);
// 字体图标的名称
const iconName = computed(() => `#${propsRef.name.value}`);
// 字体图标颜色，默认自带的颜色
const color = computed(() => propsRef?.color?.value);
// 字体图标大小，默认16px
const fontSize = computed(() =>
  propsRef.fontSize?.value
    ? parseInt(propsRef?.fontSize?.value) + "px"
    : 16 + "px"
);
</script>
<style lang="less" scoped>
.icon {
  width: v-bind(fontSize);
  height: v-bind(fontSize);
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  color: v-bind(color);
}
</style>
