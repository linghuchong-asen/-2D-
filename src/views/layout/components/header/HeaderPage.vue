<!--
 * @Description: 布局头部分，下拉菜单与用户中心
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-07 17:29:20
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-23 09:32:02
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
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeIndex = ref("1");
// 要素列表的ref
const elementListRef = ref(null);
// 点击菜单的回调函数
const handleSelect = (key: string) => {
  switch (key) {
    case "1-1":
      // 展示要素列表
      break;

    default:
      break;
  }
};

// 退出登录
const logout = () => {
  localStorage.removeItem("Authorization");
  localStorage.removeItem("refresh");
  router.push({ name: "login" });
};
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
</style>
