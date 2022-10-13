<template>
  <div style="width: 100%; height: 100%">
    <div class="title">设备状态</div>
    <div class="echarts">
      <EchartsComponent
        chartId="deviceBar"
        :option="deviceOption"
        :key="deviceBar"
        :farther-mounted="mountedFlag"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted } from "vue";
import EchartsComponent from "@/utils/EchartsComponent.vue";
import { deviceValue } from "../server";
import type { EChartsOption, LinearGradientObject } from "echarts";
import type { BarValue } from "./device";

// 设备状态，数据源类型
const barValue = reactive<BarValue>({
  radarTotal: 0,
  radarOffline: 0,
  videoTotal: 0,
  videoOffline: 0,
});
const deviceBar = ref<string>("");

// 建立websocket链接
deviceValue(barValue);

const deviceOption = reactive<EChartsOption>({});

const deviceOptionFun = (): EChartsOption => {
  // http://echarts.zhangmuchen.top/#/detail?cid=3807b-60af-0ea5-97ccf-dae1bc68
  const newchartName = ["雷达", "相机"],
    newchartValue1 = [barValue.radarTotal, barValue.videoTotal],
    newchartValue2 = [barValue.radarOffline, barValue.videoOffline];
  const barWidth = 20;
  // 设置渐变色
  const color1: LinearGradientObject = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    type: "linear",
    global: false,
    // linear-gradient(135deg,#90f7ec,#32ccbc)
    colorStops: [
      {
        //第一节下面
        offset: 0,
        color: "#90f7ec",
      },
      {
        offset: 1,
        color: "rgba(50, 204, 188,.5)",
      },
    ],
  };
  const color2: LinearGradientObject = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    type: "linear",
    global: false,
    colorStops: [
      {
        //第一节下面
        offset: 0,
        color: "#E7AB47",
      },
      {
        offset: 1,
        color: "rgba(255,164,41,.5)",
      },
    ],
  };
  return {
    // 图例
    legend: {
      data: ["总数", "异常数"],
      top: "13%",
      icon: "rect",
      itemWidth: 15,
      itemHeight: 15,
      selectedMode: false, // 禁止图例交互（隐藏某个图例柱状图上方和下方的圆环截面都会偏移）
      textStyle: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 12,
      },
    },
    //提示框
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: function (param: any) {
        return `${param[0].name}<br />${param[0].marker}${param[0].seriesName} ${param[0].data}<br />${param[1].marker}${param[1].seriesName} ${param[1].data}`;
      },
    },
    // 绘图区域
    grid: {
      top: "30%",
      left: "5%",
      bottom: "5%",
      right: "5%",
      containLabel: true,
    },
    animation: false, // 是否开启动画
    xAxis: [
      {
        type: "category", //  类目轴，适用于离散的类目数据
        // 坐标轴刻度相关设置。
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#ffffff47",
          },
        },
        axisLabel: {
          inside: false,
          color: "#fffc",
          fontWeight: "normal",
          fontSize: 12,
          margin: 20, //刻度标签与轴线之间的距离。
        },
        data: newchartName,
      },
    ],
    yAxis: [
      {
        show: true,
        type: "value",
        axisLabel: {
          color: "#fffc",
        },
        splitLine: {
          lineStyle: {
            color: "#ffffff47",
          },
        },
      },
    ],
    series: [
      // 上截面
      {
        name: "总数",
        type: "pictorialBar",
        symbolSize: [barWidth, 6],
        symbolOffset: ["-81%", -4],
        symbolPosition: "end",
        z: 15,
        color: "#90f7ec",
        zlevel: 2,
        data: newchartValue1,
      },
      {
        name: "异常数",
        type: "pictorialBar",
        symbolSize: [barWidth, 6], // 图形的大小
        symbolOffset: ["81%", -4], // 图形相对于原本位置的偏移
        symbolPosition: "end", // 图形位置
        z: 15,
        color: "#ffc241",
        zlevel: 2, // zlevel的优先级高于z;用于canvas分层
        data: newchartValue2, // 这里只要保证数组的长度等于柱状图的类型数量就行，数组中具体数值没有影响
      },

      // 柱状图
      {
        name: "总数",
        type: "bar",
        barGap: "60%", // 不同系列的柱间距离，为百分比（如 '30%'，表示柱子宽度的 30%）。
        barWidth: barWidth,
        itemStyle: {
          color: color1,
          borderColor: color1,
          borderWidth: 1,
          borderType: "solid",
        },
        z: 12,
        zlevel: 2,
        data: newchartValue1,
      },
      {
        name: "异常数",
        type: "bar",
        barGap: "60%",
        barWidth: barWidth,
        itemStyle: {
          color: color2,
          borderColor: color2,
          borderWidth: 1,
          borderType: "solid",
        },
        z: 12,
        zlevel: 2,
        // 主要是数据项要对上，否则就会出现后几个没有柱状截面的情况
        data: newchartValue2,
      },

      // 下截面
      {
        name: "总数",
        type: "pictorialBar",
        symbolSize: [barWidth, 6],
        symbolOffset: ["-81%", 4],
        z: 1,
        color: "rgba(50, 204, 188,.5)",
        // 有几个数据这里就应该有几项
        data: newchartValue2,
      },
      {
        name: "异常数",
        type: "pictorialBar",
        symbolSize: [barWidth, 6],
        symbolOffset: ["81%", 4],
        z: 1,
        color: "rgba(255,194,65,.19)",
        data: newchartValue2,
      },
    ],
  };
};

// deviceBar的值的修改只能放在watchEffect中；因为在此watchEffect中会侦听deviceOption，deviceBar两个状态的变化，如果把deviceBar.value =赋值语句拿到外面，代码同步执行，得到的是deviceBar0000；只有当deviceOption变化时，得到的才是后端返回的数据;这就是一个状态变化执行副作用（deviceOption状态变化，执行改变deviceBar的副作用）
watchEffect(() => {
  Object.assign(deviceOption, deviceOptionFun());
  // eharts容器key
  (() => {
    deviceBar.value =
      "deviceBar" +
      barValue.radarTotal +
      barValue.radarOffline +
      barValue.videoTotal +
      barValue.videoOffline;
  })();
});

/* 父组件mounted之后echarts再进行渲染 */
const mountedFlag = ref(false);
onMounted(() => {
  mountedFlag.value = true;
});
</script>
<style lang="less" scoped>
.title {
  width: 100%;
  float: left;
  font-size: 14px;
  color: #ced6e0;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
