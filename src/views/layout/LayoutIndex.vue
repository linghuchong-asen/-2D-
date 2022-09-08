<template>
  <div class="box">
    <div class="header">
      <HeaderPage></HeaderPage>
    </div>
    <div class="body">
      <div class="map">
        <div class="mapLeft"></div>
        <div class="mapRight"></div>
      </div>
      <div class="warn">
        <div class="warnLeft"></div>
        <div class="warnRight"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderPage from "./components/HeaderPage.vue";
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
        background-color: palegreen;
      }
      .mapRight {
        width: 48vw;
        height: 100%;
        float: left;
        background-color: beige;
      }
    }
    .warn {
      width: 100vw;
      height: 26%;

      .warnLeft {
        width: 52vw;
        height: 100%;
        float: left;

        background-color: brown;
      }
      .warnRight {
        width: 48vw;
        height: 100%;
        float: left;

        background-color: cadetblue;
      }
    }
  }
}
</style>
