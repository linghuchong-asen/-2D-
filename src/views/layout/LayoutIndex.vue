<template>
  <div class="box">
    <div class="header">
      <HeaderPage></HeaderPage>
    </div>
    <div class="body">
      <el-row class="map">
        <el-col></el-col>
        <el-col></el-col>
      </el-row>
      <el-row class="warn">
        <el-col></el-col>
        <el-col></el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderPage from "./components/HeaderPage.vue";
</script>
<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    flex-grow: 7;
  }
  .body {
    display: flex;
    flex-direction: column;
    flex-grow: 209;
    .map {
      flex-grow: 156;
    }
    .warn {
      flex-grow: 53;
    }
  }
}
</style>
