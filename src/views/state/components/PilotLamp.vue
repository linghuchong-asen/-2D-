<!--
 * @Description: 服务状态指示灯
 * @Author: yangsen
 * @Date: 2022-09-09 11:55:25
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-26 16:59:35
-->
<template>
  <div class="stateBox">
    <div class="title">系统状态</div>
    <div class="video">
      <div class="circleLargeVideo">
        <div class="circleSmallVideo">视频<br />服务</div>
      </div>
    </div>
    <div class="map">
      <div class="circleLargeMap">
        <div class="circleSmallMap">地图<br />服务</div>
      </div>
    </div>
    <div class="config">
      <div class="circleLargeConfig">
        <div class="circleSmallConfig">配置<br />服务</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect, type Ref } from "vue";
import { pingFun } from "@/utils";
import { getAlarmArea } from "../server";
const videoStateColor = ref("#2ed573");
const mapStateColor = ref("#2ed573");
const configStateColor = ref("#2ed573");

// 视频服务是否正常标志
const videoFlag = ref(true);
// 地图服务是否正常标志
const mapFlag = ref(true);
// 配置服务是否正常标志
const configFlag = ref(true);

//设置循环的timeout定时器
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let videoTimeoutBox: any;
const videoTimeout = (ip: string, flag: Ref<boolean>) => {
  clearTimeout(videoTimeoutBox); //初始化timeout定时器，防止定时器重叠
  videoTimeoutBox = setTimeout(function () {
    pingFun(ip)
      .then((data) => {
        flag.value = data as boolean;
      })
      .catch((error) => {
        flag.value = error;
      });
    videoTimeout(ip, flag); //循环调用函数自身，以达到循环的效果
  }, 1000);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapTimeoutBox: any;
const mapTimeout = (ip: string, flag: Ref<boolean>) => {
  clearTimeout(mapTimeoutBox); //初始化timeout定时器，防止定时器重叠
  mapTimeoutBox = setTimeout(function () {
    pingFun(ip)
      .then((data) => {
        flag.value = data as boolean;
      })
      .catch((error) => {
        flag.value = error;
      });
    mapTimeout(ip, flag); //循环调用函数自身，以达到循环的效果
  }, 1000);
};
// 视频服务
videoTimeout("192.168.0.100:9696", videoFlag);
// 地图服务
mapTimeout("192.168.0.100:8889", mapFlag);
// 配置服务
(async () => {
  try {
    const alarmAreaData = await getAlarmArea();
    const { status } = alarmAreaData;
    if (status === 200 || status === 304) {
      configFlag.value = true;
    } else {
      configFlag.value = false;
    }
  } catch (error) {
    configFlag.value = false;
  }
})();
watchEffect(() => {
  if (videoFlag.value === true) {
    videoStateColor.value = "#2ed573";
  } else {
    videoStateColor.value = "#ff4757";
  }
  if (mapFlag.value === true) {
    mapStateColor.value = "#2ed573";
  } else {
    mapStateColor.value = "#ff4757";
  }
  if (configFlag.value === true) {
    configStateColor.value = "#2ed573";
  } else {
    configStateColor.value = "#ff4757";
  }
});
</script>
<style lang="less" scoped>
.stateBox {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .title {
    width: 100%;
    height: 10%;
    font-size: 14px;
    color: #ced6e0;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .video {
    width: 100%;
    height: 45%;
    flex-grow: 2;
    display: flex;
    justify-content: center;
    align-items: center;

    .circleLargeVideo {
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;
      background-color: v-bind(videoStateColor);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 10px 1px v-bind(videoStateColor);
    }

    .circleSmallVideo {
      width: 2.5rem;
      height: 2.5rem;
      padding-top: 0.3125rem;
      border-radius: 50%;
      background-color: #fff;
      font-size: 0.75rem;
      text-align: center;
    }
  }
  .map {
    width: 50%;
    flex-grow: 1;
    display: flex;
    justify-content: center;

    .circleLargeMap {
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;
      background-color: v-bind(mapStateColor);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 10px 1px v-bind(mapStateColor);
    }

    .circleSmallMap {
      width: 2.5rem;
      height: 2.5rem;
      padding-top: 0.3125rem;
      border-radius: 50%;
      background-color: #fff;
      font-size: 0.75rem;
      text-align: center;
    }
  }
  .config {
    width: 50%;
    flex-grow: 1;
    display: flex;
    justify-content: center;

    .circleLargeConfig {
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;
      background-color: v-bind(configStateColor);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 10px 1px v-bind(configStateColor);
    }

    .circleSmallConfig {
      width: 2.5rem;
      height: 2.5rem;
      padding-top: 0.3125rem;
      border-radius: 50%;
      background-color: #fff;
      font-size: 0.75rem;
      text-align: center;
    }
  }
}
</style>
