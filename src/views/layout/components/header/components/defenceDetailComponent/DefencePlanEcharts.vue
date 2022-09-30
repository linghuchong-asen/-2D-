<template>
  <div class="echarts">
    <EchartsComponentVue
      chart-id="defencePlane"
      :option="options()"
      :key="key"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect, watch } from "vue";
import EchartsComponentVue from "@/utils/EchartsComponent.vue";
import type { EChartsOption } from "echarts";

const props = defineProps<{
  plan: {
    timeTag: number;
    startTime: string;
    endTime: string;
  }[];
}>();

// echarts的key,控制子元素重新渲染
const key = ref("");
// echarts案例
// http://echarts.zhangmuchen.top/#/detail?cid=xE2fNaCo_J
// echarts的option
const options = (): EChartsOption => {
  function formatNumber(value: any, fractions = 0) {
    const numberFormatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: fractions,
      maximumFractionDigits: fractions,
    });
    return numberFormatter.format(value);
  }

  return {
    title: {
      left: "center",
      top: "10px",
      text: "飞书office ARR",
      textStyle: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.85)",
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    yAxis: {
      type: "category",
      splitLine: {
        show: false,
      },
      data: [
        "星期一",
        "星期",
        "3&4\n双月",
        "5&6\n双月",
        "7&8\n双月",
        "9&10\n双月",
        "11&12\n双月",
        "总计",
      ],
      axisLabel: {
        interval: 0,
      },
    },
    xAxis: {
      name: "ARR: 单位(万元)",
      type: "value",
    },
    series: [
      {
        name: "Placeholder",
        type: "bar",
        barWidth: 40,
        stack: "Total",
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        data: [0, 1000, 2000, 3000, 4500, 6800, 11300, 0],
      },
      {
        name: "ARR金额",
        type: "bar",
        barWidth: 40,
        stack: "Total",
        label: {
          show: true,
          position: "top",
          formatter: (params) => formatNumber(params.value),
        },
        data: [1000, 1000, 1000, 1500, 2300, 4500, 6500, 17800],
      },
    ],
    animation: false,
  };
};
</script>
<style lang="less" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
