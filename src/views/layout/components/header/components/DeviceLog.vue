<template>
  <el-row :gutter="10">
    <!-- 左侧表单 -->
    <el-col :span="8">
      <div class="form">
        <el-form :model="deviceQueryForm">
          <el-form-item label="设备类型:">
            <el-select
              v-model="deviceQueryForm.class"
              placeholder="请选择操作类型"
              size="small"
            >
              <el-option label="全部" :value="-1" />
              <el-option label="微波雷达" :value="0" />
              <el-option label="海防" :value="1" />
              <el-option label="IO设备" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称:">
            <el-select
              v-model="deviceQueryForm.devName"
              placeholder="请选择设备名称"
              size="small"
              filterable
            >
              <el-option
                v-for="(item, index) in deviceNameList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="防区列表:">
            <el-select
              v-model="deviceQueryForm.defenceName"
              placeholder="请选择防区名称"
              size="small"
              filterable
            >
              <el-option
                v-for="(item, index) in defenceNameList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态:">
            <el-select
              v-model="deviceQueryForm.class"
              placeholder="请选择操作类型"
              size="small"
            >
              <el-option label="全部" :value="-1" />
              <el-option label="离线" :value="0" />
              <el-option label="在线" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间">
            <el-date-picker
              v-model="deviceQueryForm.startTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY/MM/DD hh:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="deviceQueryForm.endTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY/MM/DD hh:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item class="queryButton">
            <el-button type="primary" @click="deviceSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>

    <!-- 中间的样式条 -->
    <el-col class="middle" :span="1"></el-col>

    <!-- 右侧列表 -->
    <el-col :span="15">
      <div class="list">
        <div v-if="result.length !== 0">
          <el-descriptions v-for="(item, index) in result" :key="index">
            <el-descriptions-item label="设备名称:">{{
              item.devname
            }}</el-descriptions-item>
            <el-descriptions-item label="防区名称:">{{
              item.alarmarea_name
            }}</el-descriptions-item>
            <el-descriptions-item label="状态:">{{
              item.is_online === true ? "恢复正常" : "防区失效"
            }}</el-descriptions-item>
            <el-descriptions-item label="触发时间:">
              {{ item.timestamp }}
            </el-descriptions-item>
            <el-descriptions-item
              label="恢复时间"
              v-if="item.is_online === true"
              >{{ item.offlinetime }}</el-descriptions-item
            >
          </el-descriptions>
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :small="true"
            :disabled="false"
            :background="true"
            layout="prev, pager, next, jumper"
            :total="totalCount"
            @current-change="handleCurrentChange"
            v-if="pageVisible"
          />
        </div>
        <div v-else style="color: #97d0f6; font-size: 22px">暂无无数据</div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import type { DeviceQueryForm, DeviceQueryData, Result } from "./deviceLog";
import { useRequest } from "@/utils/useRequest";
import { getDefenceAll, getDeviceWarn } from "../server";
import type { DefenceAll, DeviceWarn } from "../serverType";

/* -----------setup期间，获取所有防区，组建设备名称和防区名称的数组---------------- */
// 微波雷达设备名称列表
const microwaveNameList = reactive<string[]>([]);

// 海防设备名称列表
const haiphongNameList = reactive<string[]>([]);

// IO设备名称列表
const IONameList = reactive<string[]>([]);

// 所有设备名称列表
const allNameList = reactive<string[]>([]);

// 设备名称列表
const deviceNameList = computed(() => {
  switch (deviceQueryForm.class) {
    case 0:
      return [...new Set(microwaveNameList)];
    case 1:
      return [...new Set(haiphongNameList)];
    case 2:
      return [...new Set(IONameList)];
    default:
      return [...new Set(allNameList)];
  }
});

// 防区名称列表
const defenceNameList = reactive<string[]>([]);

// 获取所有防区
const defenceAll = useRequest<DefenceAll, undefined>(getDefenceAll);
watch(defenceAll, () => {
  if (defenceAll.value !== undefined) {
    defenceAll.value.forEach((item) => {
      // 组建设备列表
      allNameList.push(item.devname);
      switch (item.devtype) {
        case 0:
          microwaveNameList.push(item.devname);
          break;
        case 1:
          haiphongNameList.push(item.devname);
          break;
        case 2:
          IONameList.push(item.devname);
          break;
        default:
          break;
      }

      // 组建防区名称列表
      if (!defenceNameList.some((value) => value === item.name))
        defenceNameList.push(item.name);
    });
  }
});

// 表单绑定数据
const deviceQueryForm = reactive<DeviceQueryForm>({});

// 表单发送数据
const deviceQueryData = reactive<DeviceQueryData>({ page: 1, page_size: 6 });

// 查询结果
const result = reactive<Result>([]);

// 发送请求函数
const serverFun = () => {
  result.splice(0, result.length);
  const deviceData = useRequest<DeviceWarn, DeviceQueryData>(
    getDeviceWarn,
    deviceQueryData
  );
  watch(deviceData, () => {
    if (deviceData.value !== undefined) {
      deviceData.value.results.forEach((item) => {
        result.push(item);
      });

      // 总数据量
      totalCount.value = deviceData.value.count;

      // 显示页码
      pageVisible.value = true;
    }
  });
};

// 查询事件
const deviceSubmit = () => {
  if (deviceQueryForm.class) deviceQueryData.devtype = deviceQueryForm.class;
  if (deviceQueryForm.defenceName)
    deviceQueryData.areaname = deviceQueryForm.defenceName;
  if (deviceQueryForm.devName)
    deviceQueryData.devname = deviceQueryForm.devName;
  if (deviceQueryForm.devState)
    deviceQueryData.is_online = deviceQueryForm.devState;
  if (deviceQueryForm.startTime)
    deviceQueryData.startdatetime = deviceQueryForm.startTime;
  if (deviceQueryForm.endTime)
    deviceQueryData.enddatetime = deviceQueryForm.endTime;
  deviceQueryData.page_size = pageSize.value;

  // 发送请求
  serverFun();
};

/* -----------右侧展示数据------------------- */
/* -----页码------ */
// 页码显示隐藏
const pageVisible = ref<boolean>(false);

// 当前页
const currentPage = ref<number>(1);

// 页容量
const pageSize = ref<number>(6);

// 总数据量
const totalCount = ref<number>(1);

// 页码发生变化时事件
const handleCurrentChange = () => {
  deviceQueryData.page = currentPage.value;
  // 发送请求
  serverFun();
};
</script>
<style lang="less" scoped></style>
