<template>
  <div class="box1">
    <!-- <el-dropdown class="dropdown">
      <el-button size="small" class="dropButton">
        <el-icon class="el-icon--left menu"><Menu /></el-icon>
        菜单
        <el-icon class="el-icon--right"><CaretRight /></el-icon>
      </el-button>
      <el-dropdown-menu>功能1</el-dropdown-menu>
      <el-dropdown-menu>功能2</el-dropdown-menu>
      <el-dropdown-menu>功能3</el-dropdown-menu>
      <el-dropdown-menu>功能4</el-dropdown-menu>
      <el-dropdown-menu>功能5</el-dropdown-menu>
      <el-dropdown-menu>功能6</el-dropdown-menu>
      <el-dropdown-menu>功能7</el-dropdown-menu>
    </el-dropdown> -->
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#1c53ab"
      active-text-color="#fff"
      text-color="#fff"
      ellipsis="false"
    >
      <el-sub-menu index="1">
        <template #title
          ><el-icon class="el-icon--left menu"><Menu /></el-icon>菜单</template
        >
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
        <el-menu-item index="1-3">item three</el-menu-item>
        <el-sub-menu index="1-4">
          <template #title>item four</template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
          <el-menu-item index="1-4-2">item two</el-menu-item>
          <el-menu-item index="1-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <div class="flex-grow" />
      <el-sub-menu index="2">
        <template #title
          ><el-icon><UserFilled /></el-icon>用户中心</template
        >

        <el-menu-item index="2-1">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
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
