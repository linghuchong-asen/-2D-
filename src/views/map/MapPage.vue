<template>
  <div style="position: relative; height: 100%; width: 100%">
    <!-- 地图的容器 -->
    <div class="wrap" id="map"></div>
    <!-- 左下角坐标  -->
    <div class="myposition" id="myposition"></div>
    <!-- 点击图标弹窗 -->
    <div id="popup" class="ol-popup">
      <span id="popup-closer" class="ol-popup-closer"></span>
      <div id="popup-content" class="popup-content"></div>
    </div>
    <div class="fullScree" @click="cut()">
      <el-icon v-if="!videoFullScreen"><BottomRight /></el-icon>
      <el-icon v-if="videoFullScreen"><TopLeft /></el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { initMap, drawAreaPolygon, drawPoint } from "./public/map.js";
import {
  getAlarmArea,
  elementProject,
  type AlarmArea,
  type ElementProject,
} from "./server";

let map: any;

// 子组件向父组件传值ts写法
const emit = defineEmits<{ (e: "fullScreen", param: boolean): void }>();

// 切换全屏视屏
const videoFullScreen = ref(false);
const cut = () => {
  videoFullScreen.value = !videoFullScreen.value;
  emit("fullScreen", videoFullScreen.value);
  setTimeout(() => {
    map.updateSize();
  }, 1);
};

// 获取全部防区
(async () => {
  try {
    const alarmAreaData = await getAlarmArea();
    const { data, status } = alarmAreaData;
    if (status === 200 || status === 304) {
      const successData = data as AlarmArea[];
      for (let i = 0; i < successData.length; i++) {
        const alarmArea = successData[i];
        const geoData = alarmArea.shape.coordinates[0];
        drawAreaPolygon(
          alarmArea.id,
          alarmArea.is_working,
          alarmArea.delay,
          alarmArea.is_bypass,
          alarmArea.is_failure,
          geoData
        );
      }
    } else {
      const errorData = data as { detail: string };
      ElMessage({ type: "error", message: errorData.detail });
    }
  } catch (error) {
    console.error("获取全部防区出错" + error);
  }
})();

// 获取全部要素
(async () => {
  try {
    const elementData = await elementProject();
    const { data, status } = elementData;
    if (status === 200 || status === 304) {
      const successData = data as ElementProject[];
      for (let i = 0; i < successData.length; i++) {
        const ele = successData[i];
        const eleText = ele.name;
        if (ele.elementtype == "point") {
          const eleStyle = JSON.parse(ele.style);
          const ptGeo = eleStyle.cGeometry;
          const iconSymbol = eleStyle.iconSymbol;
          const eleGeo = [ptGeo.X, ptGeo.Y];
          const iconUrl = iconSymbol.Url;
          // eleColor =rgbaToHexColor([textSymbol.Fill.X*255,textSymbol.Fill.Y*255,textSymbol.Fill.Z*255,textSymbol.Fill.W*255]);
          const eleColor = "#ffffff";
          drawPoint(ele.name + ele.id, iconUrl, eleText, eleColor, eleGeo);
        }
      }
    } else {
      const errorData = data as { detail: string };
      ElMessage({
        type: "error",
        message: errorData.detail,
      });
    }
  } catch (error) {
    console.error("获取全部要素出错" + error);
  }
})();

onMounted(() => {
  // 初始化地图
  map = initMap();
});
</script>
<style lang="css" scoped>
.fullScree {
  position: absolute;
  bottom: 0;
  right: 0;
  color: transparent;
  font-size: 1.5rem;
  z-index: 99999;
}
.fullScree:hover {
  cursor: pointer;
  color: red;
}
</style>
