<template>
  <div class="box">
    <div :class="Full === false ? 'header' : 'none'">
      <HeaderPage />
    </div>
    <div class="body">
      <div class="map">
        <div :class="mapFullState">
          <MapPage
            @full-screen="
              (param) => {
                mapFull = param;
              }
            "
          />
        </div>
        <div :class="videoFullState">
          <VideoPage
            @full-screen="
              (param) => {
                videoFull = param;
              }
            "
          />
        </div>
      </div>
      <div :class="Full === false ? 'warn' : 'none'">
        <div class="warnLeft">
          <WarnPage />
        </div>
        <div class="warnRight">
          <StatePage />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import HeaderPage from "./components//header/HeaderPage.vue";
import WarnPage from "../warning/WarnPage.vue";
import StatePage from "../state/StatePage.vue";
import VideoPage from "../video/VideoPage.vue";
import MapPage from "../map/MapPage.vue";

// 视屏墙全屏模式参数
const videoFull = ref<boolean>(false);
// 地图全屏模式
const mapFull = ref<boolean>(false);
// 有地图或视频其一需要展示为quanping
const Full = computed(() => {
  if (videoFull.value || mapFull.value) return true;
  return false;
});
// 视频全屏状态
const videoFullState = computed(() => {
  if (videoFull.value === false && mapFull.value === false) return "mapRight";
  if (videoFull.value === true && mapFull.value === false) return "fullScreen";
  return "none";
});
// 地图全屏状态
const mapFullState = computed(() => {
  if (videoFull.value === false && mapFull.value === false) return "mapLeft";
  if (videoFull.value === false && mapFull.value === true) return "fullScreen";
  return "none";
});

watch(videoFull, () => {
  console.log("watch视屏墙生效");
});
</script>
<style lang="less" scoped>
.box {
  width: 100vw;
  height: 100%;
  .header {
    height: 4vh;
  }
  .body {
    height: 96vh;
    .map {
      width: 100vw;
      height: 74%;

      .mapLeft {
        width: 52vw;
        height: 100%;
        float: left;
        // background-color: palegreen;
      }
      .mapRight {
        position: relative;
        width: 48vw;
        height: 100%;
        float: left;
      }
    }
    .warn {
      width: 100vw;
      height: 26%;

      .warnLeft {
        width: 52vw;
        height: 100%;
        float: left;
      }
      .warnRight {
        width: 48vw;
        height: 100%;
        float: left;
      }
    }
    .fullScreen {
      width: 100vw;
      height: 100vh;
      z-index: 999;
    }
  }
}
// 视屏墙或者地图全屏展示，其他元素隐藏
.none {
  display: none !important;
}
/* // 退出全屏图标
.quitFullScree {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10000;
  font-size: 1.5rem;
  color: transparent;
}
.quitFullScree:hover {
  cursor: pointer;
  color: red;
} */
</style>
