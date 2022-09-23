<template style="width: 100%; height: 100%">
  <EchartsComponent
    chartId="defencePie"
    :option="pieOption"
    :key="defencePie"
  />
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect } from "vue";
import EchartsComponent from "@/utils/EchartsComponent.vue";
import { defenceValue, type DefenceValue } from "../server";
import type { EChartsOption } from "echarts";

// 饼图后端websocket推送数据源，用reactive转换为响应式状态
const pieValue = reactive<DefenceValue>({
  total_num: 0, //防区总数
  failre_num: 0, // 防区失效数
  bypass_num: 0, // 旁路防区数
  not_working_num: 0, // 撤防的防区数
  alarming_num: 0, // 告警的防区数
  working_num: 0, // 布防的防区数
});
defenceValue(pieValue);

// echarts的key
const defencePie = ref<string>("");

// echarts的option
const pieOption = reactive<EChartsOption>({});

// const pieData =
// 防区状态饼状图
const pieOptionFun = (): EChartsOption => {
  return {
    // http://echarts.zhangmuchen.top/#/detail?cid=xtvbiRYHjo&version=5.3.1
    // 提示框组件
    tooltip: {
      trigger: "item",
    },
    // 标题
    title: {
      text: "防区状态",
      left: "center",
      top: 5,
      textStyle: {
        fontSize: 12,
      },
    },
    // 图标的类型，数值，属性都在series配置
    series: [
      {
        name: "防区状态", // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
        type: "pie", // 类型饼图
        center: ["50%", "55%"], // 饼图的中心点坐标
        radius: "60%", // 表示外半径为可视区尺寸（容器高宽中较小一项）的 60% 长度。
        color: ["#72FFA3", "#FF7469", "#2BD8FB", "#FFE269", "#5470c6"], // 调色盘颜色列表
        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
        label: {
          // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行。
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            if (params.value === 0) return "";
            return (
              "{icon" +
              params.color.replace("#", "") +
              "|●}{name|" +
              params.name +
              "}\n{value|" +
              params.value +
              " 个}"
            );
          },
          // 在 rich 里面，可以自定义富文本样式。利用富文本样式，可以在标签中做出非常丰富的效果。
          rich: {
            icon72FFA3: {
              color: "#72FFA3",
              fontSize: 14,
            },
            iconFF7469: {
              color: "#FF7469",
              fontSize: 14,
            },
            icon2BD8FB: {
              color: "#2BD8FB",
              fontSize: 14,
            },
            iconFFE269: {
              color: "#FFE269",
              fontSize: 14,
            },
            icon5470c6: {
              color: "#5470c6",
              fontSize: 14,
            },
            name: {
              fontSize: 10,
              fontWeight: "bold",
              padding: [0, 0, 0, 0],
              color: "#000",
            },
            percent: {
              fontSize: 10,
              color: "#000",
              padding: [0, 5, 0, 0],
            },
            value: {
              fontSize: 10,
              padding: [5, 5, 0, 10],
              color: "#000",
            },
          },
        },
        labelLine: {
          show: false,
          length: 5,
          length2: 10,
        },
        data: [
          { value: pieValue.working_num, name: "已布防" },
          { value: pieValue.not_working_num, name: "已撤防" },
          { value: pieValue.failre_num, name: "已失效" },
          { value: pieValue.alarming_num, name: "告警中" },
          { value: pieValue.bypass_num, name: "旁路中" },
        ],
        // 高亮状态的扇区和标签样式。
        emphasis: {
          // label: { fontSize: 12 },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
      {
        name: "防区状态",
        type: "pie",
        center: ["50%", "55%"],
        radius: ["0%", "60%"],
        labelLine: {
          length: 30,
        },
        label: {
          position: "inner",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            if (params.value === 0) return "";
            return params.percent + "%";
          },
          color: "#000",
          fontSize: 10,
        },
        data: [
          { value: pieValue.working_num, name: "已布防" },
          { value: pieValue.not_working_num, name: "已撤防" },
          { value: pieValue.failre_num, name: "已失效" },
          { value: pieValue.alarming_num, name: "告警中" },
          { value: pieValue.bypass_num, name: "旁路中" },
        ],
      },
    ],
  };
};

watchEffect(() => {
  Object.assign(pieOption, pieOptionFun());
  defencePie.value =
    "defencePie" +
    pieValue.failre_num +
    pieValue.bypass_num +
    pieValue.not_working_num +
    pieValue.alarming_num +
    pieValue.working_num;
});
</script>
<style lang="less" scoped></style>
