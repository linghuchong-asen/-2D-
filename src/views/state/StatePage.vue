<template>
  <div class="stateContainer">
    <div class="pilot"><PilotLamp /></div>
    <div class="defence">
      <DefenceState />
    </div>
    <div class="device">
      <DeviceState />
    </div>
  </div>
</template>
<script lang="ts" setup>
import PilotLamp from "./components/PilotLamp.vue";
import DefenceState from "./components/DefenceState.vue";
import DeviceState from "./components/DeviceState.vue";
</script>
<style lang="less" scoped>
.stateContainer {
  height: 100%;
  // background-color: #7f8c8d;
  .pilot {
    width: 33.33%;
    height: 100%;
    float: left;
    background-color: #747d8c;
  }
  .defence {
    width: 33.33%;
    height: 100%;
    float: left;
    background-color: #bdc3c7;
  }
  .device {
    width: 33.33%;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    // background-color: #130f40;
  }
}
</style>
