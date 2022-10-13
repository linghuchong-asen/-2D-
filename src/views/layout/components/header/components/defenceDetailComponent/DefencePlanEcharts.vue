<template style="width: 100%; height: 100%">
  <div style="width: 100%; height: 100%" id="echartsContainer">
    <EchartsComponentVue
      chart-id="defencePlane"
      :option="echartsOption"
      :key="key"
      :farther-mounted="mountedFlag"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref,
  watchEffect,
  toRefs,
  onMounted,
  watch,
  onUpdated,
  onUnmounted,
} from "vue";
import EchartsComponentVue from "@/utils/EchartsComponent.vue";
import type { EChartsOption, CustomSeriesRenderItemReturn } from "echarts";

const props = defineProps<{
  plan: {
    timeTag: number;
    startTime: string;
    endTime: string;
    isHas: boolean;
  }[];
}>();

const planData = toRefs(props).plan;

// 防区计划数组
const defencePlan = reactive<
  { week: number; startTime: number; endTime: number }[]
>([]);
// echarts option
const echartsOption = reactive<EChartsOption>({});

// echarts的key,控制子元素重新渲染
const key = ref(1);
// 挂载成功之后，渲染echarts
const mountedFlag = ref(false);
/* FIXME: 在Eldialog弹窗添加echarts图表，出现无法占满容器的情况。因为弹窗是异步添加进去的，
FIXME: 在setup生命周期内无法获取到容器，需要在mounted生命周期内进行再次渲染；控制组件的key就可以进行再次渲染。 */

onMounted(() => {
  key.value += 1;
  mountedFlag.value = true;
});

watchEffect(() => {
  /* NOTE: 获取到的echarts容器为null，因为Eldialog弹窗是通过弹窗添加进body，这样就是异步事件，
  NOTE: 所以在setup生命周期内无法获取到容器。和状态的饼状图不一样，状态的饼状图是在生成DOM树的时候就生成了容器。 */
  // console.log(document.getElementById("echartsContainer"));
});

// echarts案例
// http://echarts.zhangmuchen.top/#/detail?cid=xE2fNaCo_J
// echarts的option
const options = (): EChartsOption => {
  const b = defencePlan;

  const types = [
    { name: "布防", color: "#00a8ff" },
    { name: "撤防", color: "#c0c0c0" },
  ];

  const data: {
    name: string;
    itemStyle: { color: string };
    value: number[];
  }[] = [];

  data.splice(0, data.length);

  for (let i = 0; i < 7; i++) {
    // 撤防颜色填满7*24小时，后面用布防颜色覆盖撤防
    data.push({
      name: "撤防",
      itemStyle: {
        color: types[1].color,
      },
      // 第一个维度值越小，越靠下
      value: [i % 7, 0, 24],
    });
  }

  defencePlan.forEach((item) => {
    data.push({
      name: "布防",
      itemStyle: {
        color: types[0].color,
      },
      value: [item.week - 1, item.startTime, item.endTime],
    });
  });

  // data中的数据项，都会调用renderItem函数
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItem = (params: any, api: any): CustomSeriesRenderItemReturn => {
    // api.value(0)获取的是data的value的第一个维度的数据
    const categoryIndex = api.value(0);

    // api.coord()方法表示把api.value(1),categoryIndex转换为canvas坐标系上的点
    // NOTE: echarts会根据整个canvas的width与height，data数据，计算出在canvas中的坐标点；无需开发者关心
    const start = api.coord([api.value(1), categoryIndex]);

    const end = api.coord([api.value(2), categoryIndex]);

    const height = 16;

    const rectShape = {
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height,
    };

    return {
      type: "rect",
      transition: ["shape"],
      shape: rectShape,
      style: {
        fill: api.visual("color"),
      },
    };
  };
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      show: false,
    },
    grid: {
      left: "1%",
      right: "5%",
      bottom: "3%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签。
    },
    yAxis: {
      type: "category",
      show: true,
      splitLine: {
        // 坐标轴在 grid 区域中的分隔线。
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          /* NOTE: 通过设置color为transparent不显示刻度线 */
          color: "transparent",
        },
      },
      data: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ],
      // 坐标轴刻度标签的相关设置。
      axisLabel: {
        show: true,
        interval: 0,
        color: "#38c3fd",
      },
    },
    xAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#10ac84",
        },
      },
      position: "top",
      axisLabel: {
        color: "#38c3fd",
      },
      /* NOTE: 这是坐标轴的最大值与最小值 */
      min: 0,
      max: 24,
      /* NOTE: splitLine分割的数量 */
      splitNumber: 12,
    },
    series: [
      {
        type: "custom",
        renderItem: renderItem,

        itemStyle: {
          opacity: 0.8,
        },
        /* 可以定义 data 的哪个维度被编码成什么 */
        encode: {
          x: [1, 2], // 表示data的第1,2维度映射到X轴
          y: 0, // 表示data的第0维度映射到Y轴
        },
        data: data,
      },
    ],
    animation: false,
  };
};

// [props, echartsOption, defencePlan]
/* NOTE:当侦听器的副作用会引起当前组件的状态变化时，用watchEffect要好于watch。
  NOTE:因为当前组件的状态变化时，会让整个组件的代码重新执行一遍，已经赋新值的状态就会恢复初始值，也就拿不到新值了；
  NOTE:用watchEffect的话，代码重新执行的时候，在setup期间就又会执行一次，又状态赋给新值；
  NOTE:setup期间引起的状态改变，不会再次让组件代码重新执行 */
watchEffect(() => {
  // console.log(key.value);
  /* 两种情况：1.若planData.length=0，没有设置防区计划，默认7*24布防；2. 若planData.length!==0,有防区计划，按防区计划进行布防*/
  // planData.value.splice(0, planData.value.length);
  defencePlan.splice(0, defencePlan.length);

  if (planData.value.length !== 0 && planData.value[0].isHas === true) {
    // 有防区计划
    planData.value.forEach((item) => {
      /* 开始时间结束时间做数字转化 */

      // 转换函数
      const strToTimeNumber = (timeStr: string) => {
        const hour = parseInt(timeStr.slice(0, 2));
        const minute = parseInt(timeStr.slice(3, 5));
        const second = parseInt(timeStr.slice(-2));
        const timeNumber = hour + minute / 60 + second / 60 / 60;
        return timeNumber;
      };

      const startTime = strToTimeNumber(item.startTime);
      const endTime = strToTimeNumber(item.endTime);
      /* 添加防区计划到防区计划数组 */
      defencePlan.push({
        week: item.timeTag,
        startTime: startTime,
        endTime: endTime,
      });
    });
  } else {
    // 没有防区计划
    for (let i = 1; i <= 7; i++) {
      defencePlan.push({
        week: i,
        startTime: 0,
        endTime: 24,
      });
    }
  }

  Object.assign(echartsOption, options());
});
</script>
<style lang="less" scoped></style>
