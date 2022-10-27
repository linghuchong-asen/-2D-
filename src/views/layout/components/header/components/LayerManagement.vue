<!--
 * @Description: 图层管理
 * @Author: yangsen
 * @Date: 2022-09-22 20:48:05
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-25 17:14:05
-->
<template>
  <el-tabs type="border-card" stretch>
    <el-tab-pane label="摄像机">
      <el-input
        v-model="cameraInput"
        placeholder="请输入相机要素名称"
        style="margin-bottom: 20px"
        :suffix-icon="Search"
      />
      <el-tree
        :data="cameraData"
        :props="defaultProps"
        accordion
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCameraCheckedNode"
        @check-change="handleNodeClick"
        :filter-node-method="cameraSearch"
        ref="cameraTree"
        @node-click="cameraTreeClick"
      >
      </el-tree>
    </el-tab-pane>
    <el-tab-pane label="其他">
      <el-input
        v-model="otherInput"
        placeholder="请输入其他要素名称"
        style="margin-bottom: 20px"
      />
      <el-tree
        :data="otherData"
        :props="defaultProps"
        accordion
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultOtherCheckedNode"
        @check-change="handleNodeClick"
        :filter-node-method="otherSearch"
        ref="otherTree"
        @node-click="otherTreeClick"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, watch, type Ref } from "vue";
import type { FeatureData } from "../serverType";
import type { ElTree } from "element-plus";
import {
  setElementVisible,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from "@/views/map/public/map.js";
import { Search } from "@element-plus/icons-vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { setMapCenterPoint } from "@/views/map/public/map.js";

const prop = defineProps<{ data: FeatureData }>();
const dataSource = toRefs(prop);

// 默认选中所有要素
const defaultCameraCheckedNode = reactive<number[]>([]);
const defaultOtherCheckedNode = reactive<number[]>([]);

// 搜索框绑定的数据
const cameraInput = ref<string>();
const otherInput = ref<string>();

// 树控件的双击事件（单击事件配合计数器）
const treeDblClick = (
  data: Tree,
  id: Ref<number | undefined>,
  count: Ref<number>
) => {
  console.log(data);
  // 点击与上次点击的要素id不一致，计数器清零
  if (id.value !== data.id) cameraClickCount.value = 0;

  id.value = data.id;
  count.value++;

  // 300毫秒未再次发生点击事件，计数清零
  setTimeout(() => {
    count.value = 0;
  }, 300);

  if (count.value === 1) {
    // 单击事件
  } else if (count.value === 2) {
    // 双击事件
    if (data.elementtype === "point") {
      const style = JSON.parse(data.style);
      const geometry = style.cGeometry;
      setMapCenterPoint([geometry.X, geometry.Y]);
    }
  } else {
    // 点击次数过多，不进行任何操作
  }
};

/* -----------摄像机要素--------------- */

// 摄像机树实例
const cameraTree = ref<InstanceType<typeof ElTree>>();

// 摄像机数据
const cameraData = dataSource.data.value.filter(
  (item) => item.propertytype === 1
);

// 摄像机默认选中元素
cameraData.forEach((item) => {
  if (item.visible === true) defaultCameraCheckedNode.push(item.id);
});

// 搜索相机要素
interface Tree {
  id: number;
  name: string;
  style: string;
  elementtype: string;
  children?: Tree[];
}
const cameraSearch = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

watch(cameraInput, (val) => {
  cameraTree.value?.filter(val);
});

// 相机树要素id
const cameraId = ref<number>();
// 相机树点击次数
const cameraClickCount = ref<number>(0);

// 摄像机树双击事件(利用单击配合计数器)
const cameraTreeClick = (data: Tree) => {
  treeDblClick(data, cameraId, cameraClickCount);
};

/* --------其他要素---------------- */

// 其他要素树实例
const otherTree = ref<InstanceType<typeof ElTree>>();

// 其他要素树数据
const otherData = dataSource.data.value.filter(
  (item) => item.propertytype !== 1 && item.propertytype !== 0
);
// 其他要素树默认选中元素
otherData.forEach((item) => {
  if (item.visible === true) defaultOtherCheckedNode.push(item.id);
});

// 树形控件配置选项
const defaultProps = {
  label: "name",
  children: "child",
};

// 节点点击事件
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleNodeClick = (node: any, isSelfChecked: boolean) => {
  setElementVisible("element" + node.id, isSelfChecked);
};

// 其他要素树筛选事件
const otherSearch = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

watch(otherInput, (val) => {
  otherTree.value?.filter(val);
});

// 相机树要素id
const otherId = ref<number>();
// 相机树点击次数
const otherClickCount = ref<number>(0);

// 其他要素的双击事件
const otherTreeClick = (data: Tree) => {
  treeDblClick(data, otherId, otherClickCount);
};
</script>
<style lang="less" scoped></style>
