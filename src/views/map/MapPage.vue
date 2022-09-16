<template>
  <!-- 地图的容器 -->
  <div class="wrap" id="map"></div>
  <!-- 左下角坐标  -->
  <div class="myposition" id="myposition"></div>
  <!-- 点击图标弹窗 -->
  <div id="popup" class="ol-popup">
    <span id="popup-closer" class="ol-popup-closer"></span>
    <div id="popup-content" class="popup-content"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { initMap } from "./public/map.js";
onMounted(() => {
  initMap();
  console.log(document.getElementById("map"));
});
</script>
<style lang="css" scoped></style>
