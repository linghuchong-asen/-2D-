<!--
 * @Description: 布局头部分，下拉菜单与用户中心
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-07 17:29:20
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-27 16:19:32
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
        </template>
        <el-menu-item index="1-1">图层管理</el-menu-item>
        <el-menu-item index="1-2">防区管理</el-menu-item>
        <el-menu-item index="1-3">告警查询</el-menu-item>
        <el-menu-item index="1-4">操作日志</el-menu-item>
        <el-menu-item index="1-5">设备日志</el-menu-item>
        <el-menu-item index="1-6">系统配置</el-menu-item>
        <el-menu-item index="1-7">帮助</el-menu-item>
        <el-menu-item index="1-8">关于</el-menu-item>
      </el-sub-menu>
      <div class="flex-grow" />
      <h4 style="display: flex; align-items: center; color: #38c3fd">
        {{ systemStore.systemName }}
      </h4>
      <div class="flex-grow" />

      <div class="user" style="display: flex; align-items: center">
        <el-dropdown style="margin-right: 60px">
          <div class="el-dropdown-link" style="font-size: 1.25rem">
            <el-icon style="color: #fff"><UserFilled /></el-icon>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">
                <el-avatar style="width: 50px; height: 50px">
                  {{ userStore.user.userName }}
                </el-avatar>
              </el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              <el-dropdown-item @click="relieve">交接班</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-menu>
  </div>
  <!-- 图层管理 -->
  <div class="layerMange">
    <el-dialog v-model="layersVisible" width="20%" :modal="false" draggable>
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <IconFont
              name="icon-tuceng"
              style="float: left; margin-top: 0px"
              font-size="22"
            />
            <h4 style="float: left; margin-left: 10px">图层管理</h4>
          </div>
          <IconFont name="icon-guanbi" @click="close" style="cursor: pointer" />
        </div>
      </template>
      <LayerManagement :data="layersData" />
    </el-dialog>
  </div>

  <!-- 防区管理弹窗 -->
  <div class="defence">
    <el-dialog
      v-model="denfenceQueryVisible"
      width="50%"
      custom-class="defence"
      :modal="false"
      destroy-on-close
      draggable
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
      <DefenceManagement :group="groupSource"></DefenceManagement>
    </el-dialog>
  </div>

  <!-- 告警查询弹窗 -->
  <div class="warnQuery">
    <el-dialog
      v-model="warnQueryVisible"
      title="告警查询"
      width="30%"
      :modal="false"
      :close-on-click-modal="false"
      destroy-on-close
      draggable
    >
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <IconFont
              name="icon-gaojing"
              font-size="22"
              style="float: left"
            ></IconFont>
            <h4 style="float: left; margin-left: 10px">告警查询</h4>
          </div>
          <IconFont
            name="icon-guanbi"
            @click="close"
            style="cursor: pointer"
          ></IconFont>
        </div>
      </template>
      <WarnQuery
        @hide="
          () => {
            warnQueryVisible = false;
          }
        "
      />
    </el-dialog>
  </div>

  <!-- 操作日志 -->
  <div class="operationLog">
    <el-dialog
      v-model="operationVisible"
      title="操作日志"
      width="55%"
      :modal="false"
      destroy-on-close
      draggable
    >
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <IconFont
              name="icon-caozuo"
              style="float: left; margin-top: 0px"
              font-size="22"
            />
            <h4 style="float: left; margin-left: 10px">操作日志</h4>
          </div>
          <IconFont name="icon-guanbi" @click="close" style="cursor: pointer" />
        </div>
      </template>
      <OperationLog />
    </el-dialog>
  </div>

  <!-- 设备日志 -->
  <div class="deviceLog">
    <el-dialog
      v-model="deviceVisible"
      title="设备日志"
      width="55%"
      :modal="false"
      destroy-on-close
      draggable
    >
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <IconFont
              name="icon-shebei"
              style="float: left; margin-top: 0px"
              font-size="22"
            />
            <h4 style="float: left; margin-left: 10px">设备日志</h4>
          </div>
          <IconFont name="icon-guanbi" @click="close" style="cursor: pointer" />
        </div>
      </template>
      <DeviceLog />
    </el-dialog>
  </div>

  <!-- 系统配置 -->
  <div class="systemConfig">
    <el-dialog
      v-model="systemVisible"
      width="22%"
      :modal="false"
      destroy-on-close
      draggable
    >
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <IconFont
              name="icon-xitong"
              style="float: left; margin-top: 0px"
              font-size="22"
            />
            <h4 style="float: left; margin-left: 10px">系统配置</h4>
          </div>
          <IconFont name="icon-guanbi" @click="close" style="cursor: pointer" />
        </div>
      </template>
      <SystemConfig @visible="() => (systemVisible = false)" />
    </el-dialog>
  </div>

  <!-- 关于 -->
  <div class="about">
    <el-dialog
      v-model="aboutVisible"
      width="15%"
      :modal="false"
      destroy-on-close
      draggable
    >
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <IconFont
              name="icon-guanyu1"
              style="float: left; margin-top: 0px"
              font-size="22"
            />
            <h4 style="float: left; margin-left: 10px">系统配置</h4>
          </div>
          <IconFont name="icon-guanbi" @click="close" style="cursor: pointer" />
        </div>
      </template>
      <div>
        <div>(C) 2022-2023浙江宇视科技有限公司</div>
        <div style="margin-top: 10px; margin-bottom: 10px">
          版本 3D_GIS1.0-RO1.220617
        </div>
        <div>Build 2022.03.31.01</div>
      </div>
    </el-dialog>
  </div>

  <!-- 交接班弹窗 -->
  <div class="relieve">
    <el-dialog
      v-model="relieveVisible"
      width="22%"
      :modal="false"
      destroy-on-close
      draggable
    >
      <template #header="{ close }">
        <div class="myHeader">
          <div>
            <h4 style="float: left; margin-left: 10px">交接班管理</h4>
          </div>
          <IconFont name="icon-guanbi" @click="close" style="cursor: pointer" />
        </div>
      </template>
      <RelievePage @visible="() => (relieveVisible = false)" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import DefenceManagement from "./components/DefenceManagement.vue";
import WarnQuery from "./components/WarnQuery.vue";
import IconFont from "@/utils/IconFont.vue";
import { getDefenceGroup, getAllFeature } from "./server";
import type { DefenceGroup } from "./serverType";
import { ElMessage } from "element-plus";
import LayerManagement from "./components/LayerManagement.vue";
import { useRequest } from "@/utils/useRequest";
import type { FeatureData } from "./serverType";
import SystemConfig from "./components/SystemConfig.vue";
import OperationLog from "./components/OperationLog.vue";
import DeviceLog from "./components/DeviceLog.vue";
import { useSystemStore } from "@/stores/systemStore";
import { useUserStore } from "@/stores/userStore";
import RelievePage from "./components/RelievePage.vue";

const systemStore = useSystemStore();
const userStore = useUserStore();

const router = useRouter();
const activeIndex = ref("1");

// 点击菜单的回调函数
const handleSelect = (key: string) => {
  switch (key) {
    case "1-1":
      // 图层管理
      layersFun();
      break;
    case "1-2":
      // 防区管理
      changeDefenceQueryVisible();
      break;
    case "1-3":
      // 告警查询
      warnQueryVisible.value = true;
      break;
    case "1-4":
      // 操作日志
      operationVisible.value = true;
      break;
    case "1-5":
      // 设备日志
      deviceVisible.value = true;
      break;
    case "1-6":
      // 系统配置
      systemVisible.value = true;
      break;
    case "1-8":
      aboutVisible.value = true;
      break;
    default:
      break;
  }
};

/* --------图层管理---------- */
// 图层管理的显隐
const layersVisible = ref(false);
// 图层管理数据
const layersData = reactive<FeatureData>([]);
// 图层管理请求数据
const layersFun = () => {
  layersData.splice(0, layersData.length);

  const layersSource = useRequest<FeatureData, undefined>(getAllFeature);
  watch(layersSource, () => {
    if (layersSource.value !== undefined) {
      layersSource.value.forEach((item) => {
        layersData.push(item);
      });
      layersVisible.value = true;
    }
  });
};
/* ------------------防区管理-------------------------- */
// 防区分组
const groupSource = reactive<DefenceGroup>([]);
// 防区查询对话框显示隐藏
const denfenceQueryVisible = ref(false);
const changeDefenceQueryVisible = async () => {
  // 获取防区分组
  try {
    const defenceGroupData = await getDefenceGroup();
    const { data, status } = defenceGroupData;
    if (status === 200) {
      const successData = data as DefenceGroup;
      successData.forEach((item) => {
        groupSource.push({
          alarmareas: item.alarmareas,
          descr: item.descr,
          id: item.id,
          name: item.name,
        });
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

/* -------------告警查询--------------------- */
const warnQueryVisible = ref(false);

/* -------------系统配置----------------- */
// 弹窗显隐
const systemVisible = ref<boolean>(false);

/* -------------操作日志------------ */
// 弹窗显隐
const operationVisible = ref<boolean>(false);

/* -------------设备日志------------ */
// 弹窗显隐
const deviceVisible = ref<boolean>(false);

/* --------------关于---------------- */
// 关于弹窗的显示隐藏
const aboutVisible = ref<boolean>(false);

/* -------------------退出登录---------------------------------  */
const logout = () => {
  localStorage.removeItem("Authorization");
  localStorage.removeItem("refresh");
  router.push({ name: "login" });
};

/* ----------交接班------------------- */

//交接班显示隐藏
const relieveVisible = ref<boolean>(false);

const relieve = () => {
  relieveVisible.value = true;
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
.myHeader {
  display: flex;
  justify-content: space-between;
}
</style>
