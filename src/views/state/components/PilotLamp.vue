<template>
  <div class="stateBox">
    <div class="video">
      <div class="circleLarge">
        <div class="circleSmall">视频<br />服务</div>
      </div>
    </div>
    <div class="map">
      <div class="circleLarge">
        <div class="circleSmall">地图<br />服务</div>
      </div>
    </div>
    <div class="config">
      <div class="circleLarge">
        <div class="circleSmall">配置<br />服务</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const stateColor = ref("#2ed573");
</script>
<style lang="less" scoped>
.stateBox {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.video {
  width: 100%;
  height: 50%;
  flex-grow: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.map {
  width: 50%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
}
.config {
  width: 50%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
}
.circleLarge {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  background-color: v-bind(stateColor);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px 1px v-bind(stateColor);

  .circleSmall {
    width: 2.5rem;
    height: 2.5rem;
    padding-top: 0.3125rem;
    border-radius: 50%;
    background-color: #fff;
    font-size: 0.75rem;
    text-align: center;
  }
}
</style>
