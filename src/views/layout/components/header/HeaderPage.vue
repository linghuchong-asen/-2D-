<!--
 * @Description: 布局头部分，下拉菜单与用户中心
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-07 17:29:20
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-30 11:29:06
-->
<template>
  <div class="box1">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#1c53ab"
      active-text-color="#fff"
      text-color="#fff"
      :ellipsis="false"
    >
      <el-sub-menu index="1" popper-class="subMenu">
        <template #title>
          <el-icon class="el-icon--left"><Menu /></el-icon>
          菜单
        </template>
        <el-menu-item index="1-1" ref="elementListRef">图层管理</el-menu-item>
        <el-menu-item index="1-2">防区管理</el-menu-item>
        <el-menu-item index="1-3">告警查询</el-menu-item>
        <el-menu-item index="1-4">操作日志</el-menu-item>
        <el-menu-item index="1-5">设备日志</el-menu-item>
        <el-menu-item index="1-6">系统配置</el-menu-item>
        <el-menu-item index="1-7">帮助</el-menu-item>
        <el-menu-item index="1-8">关于</el-menu-item>
      </el-sub-menu>
      <div class="flex-grow" />
      <el-dropdown style="margin-right: 1.25rem; align-items: center">
        <div class="el-dropdown-link" style="font-size: 1.25rem">
          <el-icon style="color: #fff"><UserFilled /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-menu>
    <el-popover
      ref="popoverRef"
      :virtual-ref="elementListRef"
      trigger="click"
      title="With title"
      virtual-triggering
    >
      <span> Some content </span>
    </el-popover>
  </div>

  <!-- 防区管理弹窗 -->
  <div class="defence">
    <el-dialog
      v-model="denfenceQueryVisible"
      title="Tips"
      width="70%"
      custom-class="defence"
      :modal="false"
      :close-on-click-modal="false"
    >
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <IconFont
              name="icon-anfangquyuguanli"
              style="float: left; margin-top: 3px"
            ></IconFont>
            <h4 style="float: left; margin-left: 10px">防区状态</h4>
          </div>
          <IconFont
            name="icon-guanbi"
            @click="close"
            style="cursor: pointer"
          ></IconFont>
        </div>
      </template>
      <DefenceManagement :group="defenceGroup"></DefenceManagement>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUpdated, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import DefenceManagement from "./components/DefenceManagement.vue";
import IconFont from "@/utils/IconFont.vue";
import { getDefenceGroup, type DefenceGroup } from "./server";
import { ElMessage } from "element-plus";

const router = useRouter();
const activeIndex = ref("1");
// 图层管理的ref
const elementListRef = ref(null);
// 点击菜单的回调函数
const handleSelect = (key: string) => {
  switch (key) {
    case "1-1":
      // 展示要素列表
      break;
    case "1-2":
      // 防区管理
      changeDefenceQueryVisible();
      break;
    default:
      break;
  }
};

/* ------------------防区管理-------------------------- */
// 防区分组
const defenceGroup = reactive<string[]>([]);
// 防区查询对话框显示隐藏
const denfenceQueryVisible = ref(false);
const changeDefenceQueryVisible = async () => {
  // 获取防区分组
  try {
    const defenceGroupData = await getDefenceGroup();
    const { data, status } = defenceGroupData;
    if (status === 200) {
      const successData = data as DefenceGroup[];
      successData.forEach((item) => {
        defenceGroup.push(item.name);
      });
    } else {
      const errorData = data as { detail: string };
      ElMessage({
        type: "error",
        message: errorData.detail,
      });
    }
  } catch (error) {
    console.error("获取防区分组出错" + error);
  }
  denfenceQueryVisible.value = !denfenceQueryVisible.value;
};

/* -------------------退出登录---------------------------------  */
const logout = () => {
  localStorage.removeItem("Authorization");
  localStorage.removeItem("refresh");
  router.push({ name: "login" });
};

onMounted(() => {
  console.log("防区管理组件onMounted");
});
onUpdated(() => {
  console.log("防区管理组件onUpdated");
});
onUnmounted(() => {
  console.log("防区管理组件onUnmounted");
});
</script>
<style scoped lang="less">
.box1 {
  width: 100%;
  height: 100%;

  /deep/ .el-menu-demo {
    height: 100%;

    .flex-grow {
      flex-grow: 1;
    }
  }
}
.myHeader {
  display: flex;
  justify-content: space-between;
}
</style>
