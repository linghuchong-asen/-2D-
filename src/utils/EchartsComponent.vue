<template>
  <!-- FIXME:问题：页面自适应布局，当有tooltip时，会出现滚动条 -->
  <!-- FIXME:解决：添加上overflow:hidden属性 -->
  <div :id="id" style="width: 100%; height: 90%; overflow: hidden"></div>
</template>

<script setup lang="ts">
import { toRefs, onUnmounted, onMounted } from "vue";
import * as echarts from "echarts";
import type { EChartsOption, ECharts } from "echarts";
// 接收父组件传值
const props = defineProps<{
  chartId: string;
  option: unknown;
  /* FIXME:这是一个完善，有些父元素是Dialog这种弹窗，弹窗是element用渲染函数生成的DOM元素添加进body中，
  FIXME:是异步添加的，所以要等待父组件添加成功之后再进行echarts绘制 */
  fartherMounted: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleClick?: (params: any) => void;
}>();

/* toRefs()将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref；
   使用toRefs()就可以使用解构赋值，不然报错在setup根下使用解构会失去响应性
   .value是实际的值
*/
const id = toRefs(props).chartId;
const fartherMounted = toRefs(props).fartherMounted;
const option = toRefs(props).option.value as EChartsOption;
let chart: ECharts | null;

// 图标配置及渲染
const renderChart = (chart: ECharts, option: EChartsOption) => {
  const handleClick = props.handleClick;
  chart.clear(); // 生成画布前执行clear操作
  chart.setOption(option); // 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过 setOption 完成
  chart.off("click"); // 不加上off解绑事件，事件会累加，可能重复n次
  chart.on("click", (params) => {
    if (handleClick) {
      handleClick(params);
    }
  });
};
// 放大缩小重新布局
const handleResize = () => {
  if (chart) chart.resize();
};
// 页面渲染成功及id变化时，绘制图表;
onMounted(() => {
  const chartIdDiv = document.getElementById(id.value);
  if (chartIdDiv && fartherMounted.value) {
    chart = echarts.init(chartIdDiv); // 创建一个echarts实例
    if (option) renderChart(chart, option);
  }
});

// 监听窗口的resize事件
window.addEventListener("resize", handleResize);
// 组件卸载时，去除监听事件，销毁echarts
onUnmounted(() => {
  window.removeEventListener("resize", handleResize); // 去除监听事件
  // 销毁echarts
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>
<style scoped lang="less"></style>
