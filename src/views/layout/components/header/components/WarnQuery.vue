<!--
 * @Description: 告警查询组件
 * @Author: yangsen
 * @Date: 2022-10-14 15:01:42
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-26 09:37:41
-->
<template>
  <div class="historyWarn">
    <el-form :model="warnQueryData">
      <el-form-item label="防区分组:">
        <el-select
          v-model="warnQueryData.group"
          placeholder="请选择防区分组"
          size="small"
        >
          <el-option
            v-for="(item, index) in defenceGroup"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="防区名称:">
        <el-select
          v-model="warnQueryData.name"
          placeholder="请选择防区名称"
          size="small"
          filterable
        >
          <el-option
            v-for="(item, index) in defenceNameList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="防区名称支持搜索"
          placement="top"
        >
          <div class="nameList">
            <IconFont name="icon-tishi2" />
          </div>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="告警状态:">
        <el-select
          v-model="warnQueryData.state"
          placeholder="请选择告警状态"
          size="small"
          class="selectLength"
        >
          <el-option label="全部" :value="0" />
          <el-option label="已处置" :value="1" />
          <el-option label="待处置" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="消音状态:">
        <el-select
          v-model="warnQueryData.erasureState"
          placeholder="请选择消音状态"
          size="small"
          class="selectLength"
        >
          <el-option label="未消音" :value="0" />
          <el-option label="已消音" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="warnQueryData.startTime"
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="warnQueryData.endTime"
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item class="queryButton">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, ref } from "vue";
import { getDefenceGroup, getDefenceAll, getWarnHistory } from "../server";
import type {
  DefenceGroup,
  DefenceAll,
  WarnHistoryParams,
  WarnHistoryData,
} from "../serverType";
import { useRequest } from "@/utils/useRequest";
import IconFont from "@/utils/IconFont.vue";
import type { DefenceNameList, Group, QueryData } from "./warnQuery";
import { useWarnStore } from "@/stores/warnStore";
import { ElMessage } from "element-plus";

// 全局历史告警状态
const warnStore = useWarnStore();

const emit = defineEmits<{
  (e: "hide"): void;
}>();

// 查询成功提示标识
const tipFlag = ref(false);

// 表单绑定数据
const warnQueryData = reactive<QueryData>({});

// 提交表单数据
const warnQueryForm = warnStore.historyQueryForm;

// 提交表单
const onSubmit = async () => {
  // 转换告警状态
  if (warnQueryData.state === 1) {
    warnQueryForm.cfmstate = 1;
  } else if (warnQueryData.state === 2) {
    warnQueryForm.cfmstate = 0;
  }

  if (warnQueryData.erasureState)
    warnQueryForm.erasurestate = warnQueryData.erasureState;

  if (warnQueryData.startTime)
    warnQueryForm.startdatetime = warnQueryData.startTime;
  if (warnQueryData.endTime) warnQueryForm.enddatetime = warnQueryData.endTime;
  if (warnQueryData.name) warnQueryForm.alarmarea_name = warnQueryData.name;
  if (warnQueryData.group) warnQueryForm.areanogroup = warnQueryData.group;

  // 发送请求
  const history = useRequest<WarnHistoryData, WarnHistoryParams>(
    getWarnHistory,
    warnQueryForm
  );
  watch(history, () => {
    if (history.value !== undefined) {
      // 请求成功，将告警历史查询结果储存在全局store
      warnStore.historyWarn = [...history.value];

      // 页面告警tab页显示为历史告警
      warnStore.tabActive = "historyWarn";

      // 弹出查询成功提示
      tipFlag.value = true;

      // 隐藏查询弹窗
      emit("hide");

      // 重置表单数据
      warnStore.resetHistoryQueryForm();
    }
  });
};

// 查询成功弹窗
watch(tipFlag, () => {
  ElMessage({ type: "success", message: "告警查询成功" });
});

/* ----------防区分组------------ */
const defenceGroup = reactive<Group>([]);

// 调用组合式函数，对defenceGroup赋值

const group = useRequest<DefenceGroup, undefined>(getDefenceGroup);
watch(group, () => {
  if (group.value !== undefined) {
    group.value.forEach((item) => {
      defenceGroup.push({
        name: item.name,
        id: item.id,
      });
    });
  }
});

//* --------防区名称列表----------- */
const defenceNameList = reactive<DefenceNameList>([]);

// 调用组合式函数，对defenceNameList赋值
const defenceAll = useRequest<DefenceAll, undefined>(getDefenceAll);
watch(defenceAll, () => {
  if (defenceAll.value !== undefined) {
    defenceAll.value.forEach((item) => {
      defenceNameList.push({
        name: item.name,
        id: item.id,
      });
    });
  }
});

/* defenceAll.forEach((item) => {

}) */
</script>
<style lang="less" scoped></style>
