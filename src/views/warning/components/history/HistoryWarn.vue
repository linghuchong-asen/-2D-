<!--
 * @Description: 历史告警展示组件
 * @Author: yangsen
 * @Date: 2022-09-08 17:14:36
 * @LastEditors: yangsen
 * @LastEditTime: 2022-11-01 20:08:17
-->
<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      size="small"
      height="200"
      :cell-style="{ backgroundColor: '#263e73', color: '#97d0f6' }"
      :header-cell-style="{ backgroundColor: '#0e2454', color: '#d9d9d9' }"
    >
      <el-table-column
        prop="number"
        label="告警编号"
        width="150"
        fixed
        align="center"
      />
      <el-table-column
        prop="inputDevice"
        label="输入设备"
        width="80"
        align="center"
      />
      <el-table-column
        prop="deviceName"
        label="设备名称"
        width="120"
        align="center"
      />
      <el-table-column
        prop="defenceName"
        label="防区名称"
        width="180"
        align="center"
      />
      <el-table-column
        prop="warnSate"
        label="告警状态"
        width="80"
        align="center"
      />
      <el-table-column
        prop="operationUser"
        label="操作人"
        width="80"
        align="center"
      />
      <el-table-column
        prop="time"
        label="告警时间"
        width="300"
        align="center"
      />
      <el-table-column label="操作" fixed="right" width="180" align="center">
        <template #default="scope">
          <el-popover
            trigger="click"
            :width="400"
            placement="right"
            popper-class="handleWarn"
            :show-arrow="false"
            title="历史告警处置"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                round
                ref="infoButton"
                v-if="scope.row.operation === '处置'"
                >{{ scope.row.operation }}
              </el-button>
            </template>
            <!-- 历史告警处置表单 -->
            <el-form
              :inline="true"
              :model="handleWarnForm"
              ref="handleWarnInstance"
              :rules="handelWarnRule"
            >
              <el-form-item label="处置描述: " prop="description">
                <el-input
                  v-model="handleWarnForm.description"
                  :rows="2"
                  type="textarea"
                  placeholder="请输入处置描述"
                />
              </el-form-item>
              <el-form-item label="处置类型: " prop="type">
                <el-select
                  v-model="handleWarnForm.type"
                  placeholder="请选择处置类型"
                  size="small"
                  class="selectLength"
                  :teleported="false"
                >
                  <el-option label="忽略" value="忽略" />
                  <el-option label="人工处置" value="人工处置" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="
                    handleWarnSubmit(
                      scope.row.number,
                      scope.row.inputDevice,
                      scope.row.defenceId
                    )
                  "
                  >消警</el-button
                >
              </el-form-item>
            </el-form>
          </el-popover>
          <!-- 处置信息popover -->
          <el-popover
            trigger="click"
            :width="250"
            placement="right"
            title="处置信息"
            popper-class="handleInfo"
            :show-arrow="false"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                round
                ref="infoButton"
                v-if="scope.row.operation === '信息'"
                @click="infoClick(scope.row.number)"
                >{{ scope.row.operation }}
              </el-button>
            </template>
            <div class="info">
              <div style="margin-bottom: 10px">
                <label>处置类型：</label>
                <span>{{ infoHandleType }}</span>
              </div>
              <div>
                <label>处置描述：</label>
                <span>{{ infoHandleDes }}</span>
              </div>
            </div>
          </el-popover>

          <el-button
            type="primary"
            size="small"
            round
            @click="
              operationFun(
                scope.row.defenceId,
                scope.row.startTime,
                scope.row.endTime
              )
            "
            >视频</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { useWarnStore } from "@/stores/warnStore";
import { useVideoStore } from "@/stores/videoStore";
import {
  getDirectionInfo,
  getUsers,
  getAssignDefence,
  handleWarnSever,
  type DirectionInfoData,
  type DirectionInfoParams,
  type Users,
  type AssignDefence,
  type HandleWarnSeverData,
} from "../../server";
import { useRequest } from "@/utils/useRequest";
import { ref, reactive, watch } from "vue";
import type { TableData } from "./histotyWarn";
import { ElMessage, ElNotification, type FormInstance } from "element-plus";
import { getAssignAfter } from "@/utils/index";
import type { HandleWarnData } from "../realTime/realTime";
import { getFormateTime } from "@/utils/index";

// 历史告警查询结果，全局状态
const warnStore = useWarnStore();
// 视频播放，全局状态
const videoStore = useVideoStore();

// table绑定数据
const tableData = reactive<TableData>([]);

// 输入设备
const inputDevice = (item: number) => {
  switch (item) {
    case 0:
      return "微波雷达";
    case 1:
      return "海防";
    case 2:
      return "IO设备";
    default:
      return "无";
  }
};

// 存放关联相机，联动相机数组
const cameraArr = reactive<number[]>([]);

// 获取指定防区函数,播放历史视频
const getDefenceFun = (
  defenceId: number,
  startTime: string,
  endTime: string
) => {
  const data = useRequest<AssignDefence, number>(getAssignDefence, defenceId);
  watch(data, () => {
    if (data.value !== undefined) {
      cameraArr.splice(0, cameraArr.length);
      data.value.tracecamera.forEach((item) => cameraArr.push(item));
      data.value.linkcamera.forEach((item) => cameraArr.push(item.id));

      // 判断联动，关联相机是否为空
      if (cameraArr.length === 0) {
        ElNotification({
          message: "没有联动或关联相机",
          type: "info",
        });
      } else {
        // 历史告警播放视频，报警开始时间往前30秒，报警结束时间往后30秒

        const historyStartTime = getAssignAfter(startTime, -30);
        const historyEndTime = getAssignAfter(endTime, 30);

        cameraArr.forEach((item, index) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          videoStore.video.playHisSelect(
            index,
            item,
            historyStartTime,
            historyEndTime
          );
        });
      }
    }
  });
};

// 点击视频按钮函数
const operationFun = (
  defenceId: number,
  startTime: string,
  endTime: string
) => {
  // 点击视频按钮处理逻辑
  getDefenceFun(defenceId, startTime, endTime);
};

// 获取操作人姓名
const userName = ref<string>("无");
const useTranslateUser = (alarmNumber: string) => {
  const directionInfo = useRequest<DirectionInfoData, DirectionInfoParams>(
    getDirectionInfo,
    { obj_id: alarmNumber }
  );
  if (directionInfo.value !== undefined) {
    // 请求成功，用操作人id，获取操作人姓名
    const name = useRequest<Users, number>(
      getUsers,
      directionInfo.value[0].user
    );
    if (name.value !== undefined) {
      userName.value = name.value.username;
    }
  }
};

/* -------------配置table数据------------------- */
watch([warnStore, userName], () => {
  tableData.splice(0, tableData.length);
  warnStore.historyWarn.forEach((item) => {
    // 告警状态 已处置显示为已处置；未处置分两种情况：未消音和已消音
    let state;
    if (item.cfmstate === 1) {
      state = "已处置";
    } else {
      if (item.erasurestate === 1) {
        state = "已消音";
      } else {
        state = "未消音";
      }
    }

    // 获取操作人姓名
    useTranslateUser(item.obj_id);

    // 操作第一个按钮显示的文字
    let firstButton;
    if (item.cfmstate === 1) {
      firstButton = "信息";
    } else {
      firstButton = "处置";
    }

    tableData.push({
      number: item.obj_id, // 告警编号
      inputDevice: inputDevice(item.devtype), // 输入类型
      deviceName: item.devname,
      defenceName: item.alarmarea_name,
      warnSate: state,
      operationUser: userName.value,
      operation: firstButton,
      time: `${item.starttime} -- ${item.endtime}`,
      defenceId: item.alarmarea, // 防区id
      startTime: item.starttime, // 开始时间
      endTime: item.endtime, // 结束时间
    });
  });
});

/* -------------点击处置按钮---------------- */

// 处置表单绑定数据
const handleWarnForm = reactive<{ type: string; description: string }>({
  type: "",
  description: "",
});

// 处置表单提交数据
const handleWarnData = reactive<HandleWarnData>({
  cfmtype: "", // 处置类型 忽略/人工处置
  cfmdesc: "", // 处置描述
  type: 2, //  处置方式 1：消音 2:消警
  cfmtime: "", // 处置时间
  alarmtype: "", // 告警类型 0 雷达告警 1海防  2.io告警
  obj_id: "", // 告警编号
  area: -1, // 防区id
});

// 处置表单实例
const handleWarnInstance = ref<FormInstance>();

// 处置表单验证规则
const handelWarnRule = {
  type: [{ required: true, trigger: "blur", message: "此项为必填项" }],
  description: [{ required: true, trigger: "blur", message: "此项为必填项" }],
};

// 处置表单提交事件
const handleWarnSubmit = (No: string, type: string, defenceId: number) => {
  let alarmType!: string;
  switch (type) {
    case "微波雷达":
      alarmType = "0";
      break;
    case "海防":
      alarmType = "1";
      break;
    case "IO设备":
      alarmType = "2";
      break;
    default:
      break;
  }
  // 配置表单项
  handleWarnData.cfmtime = getFormateTime();
  handleWarnData.cfmtype = handleWarnForm.type;
  handleWarnData.cfmdesc = handleWarnForm.description;
  handleWarnData.obj_id = No;
  handleWarnData.area = defenceId;
  handleWarnData.alarmtype = alarmType;

  // 发送请求
  const data = useRequest<HandleWarnSeverData, HandleWarnData>(
    handleWarnSever,
    handleWarnData
  );

  let count = 0;
  watch(data, () => {
    count++;
    if (data.value !== undefined) {
      if (count === 1) ElMessage({ type: "success", message: "处置告警成功" });
    }
  });
};

/* -------------点击信息popover------------------ */

// 处置类型
const infoHandleType = ref<string>();

// 处置描述
const infoHandleDes = ref<string>();

// 点击信息按钮事件
const infoClick = (No: string) => {
  const data = useRequest<DirectionInfoData, DirectionInfoParams>(
    getDirectionInfo,
    { obj_id: No }
  );
  watch(data, () => {
    if (data.value !== undefined) {
      infoHandleType.value = data.value[0].cfmtype;
      infoHandleDes.value = data.value[0].cfmdesc;
    }
  });
};
</script>
<style scoped lang="less"></style>
