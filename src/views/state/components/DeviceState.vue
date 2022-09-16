<template>
  <div style="width: 100%; height: 100%">
    <EchartsComponent chartId="deviceBar" :option="deviceOption()" />
  </div>
</template>
<script lang="ts" setup>
import EchartsComponent from "@/utils/EchartsComponent.vue";
import type { EChartsOption, LinearGradientObject } from "echarts";

const deviceOption = (): EChartsOption => {
  const newchartName = ["雷达", "相机"],
    newchartValue1 = ["91", "51"],
    newchartValue2 = ["83", "81"];
  const barWidth = 20;
  // 设置渐变色
  const color1: LinearGradientObject = {
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
        color: "#1C98CD",
      },
      {
        offset: 1,
        color: "rgba(61,187,255,.26)",
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
        color: "rgba(255,164,41,.26)",
      },
    ],
  };
  return {
    backgroundColor: "#000E1A", //背景色
    // 图例
    legend: {
      data: ["总数", "异常数"],
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
        // console.log(param, 'param');
        return `${param[0].name}<br />${param[0].marker}${param[0].seriesName} ${param[0].data}<br />${param[1].marker}${param[1].seriesName} ${param[1].data}`;
      },
    },
    // 绘图区域
    grid: {
      top: "25%",
      left: "5%",
      bottom: "10%",
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
        color: "#3eb6f5",
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
        data: newchartValue2,
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
        color: "rgba(62,182,245,.19)",
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
</script>
<style lang="less" scoped></style>
