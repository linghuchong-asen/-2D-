<template>
  <div class="wall-container"></div>
  <div class="fullScree" @click="cut()">
    <el-icon v-if="!videoFullScreen"><BottomLeft /></el-icon>
    <el-icon v-if="videoFullScreen"><TopRight /></el-icon>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { initServer, PlayerWallProcessor } from "./public/play.js";
import { getGlobalVar } from "@/utils/index";

const instance = getGlobalVar();

// 子组件向父组件传值ts写法
const emit = defineEmits<{ (e: "fullScreen", param: boolean): void }>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let playerWall: any;

// 切换全屏视屏
const videoFullScreen = ref(false);
const cut = () => {
  videoFullScreen.value = !videoFullScreen.value;
  emit("fullScreen", videoFullScreen.value);
  // 切换视频墙窗格
  playerWall.cutFlag();
};

onMounted(() => {
  let httpUrl;
  if (instance) httpUrl = instance.$httpBaseUrl;
  // 初始化
  initServer(httpUrl);
  //   新建视频墙控制器实例
  playerWall = new PlayerWallProcessor(1);
  playerWall.initWall();
});
</script>
<style lang="css" scoped>
.fullScree {
  position: absolute;
  bottom: 0;
  left: 0;
  color: transparent;
  font-size: 1.5rem;
}
.fullScree:hover {
  cursor: pointer;
  color: red;
}
</style>
