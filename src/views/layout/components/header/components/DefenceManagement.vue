<!--
 * @Description: 防区管理，包括查询表单和展示表格
 * @Author: yangsen
 * @Date: 2022-09-28 11:12:20
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-26 15:02:37
-->
<template>
  <div class="defenceContent">
    <!-- 查询表单 -->
    <div class="query">
      <el-form :inline="true" :model="queryFormData" class="form">
        <el-form-item label="防区分组:">
          <el-select
            v-model="queryFormData.group"
            placeholder="请选择防区分组"
            size="small"
            class="selectLength"
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
          <el-input
            v-model="queryFormData.name"
            placeholder="请输入防区名称"
            size="small"
            class="selectLength"
          />
        </el-form-item>
        <el-form-item label="防区类型:">
          <el-select
            v-model="queryFormData.type"
            placeholder="请选择防区类型"
            size="small"
            class="selectLength"
          >
            <el-option label="24H防区" :value="1" />
            <el-option label="即时防区" :value="2" />
            <el-option label="延时防区" :value="3" />
            <el-option label="火警防区" :value="4" />
            <el-option label="关联防区" :value="5" />
            <el-option label="智能防区" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="防区状态:">
          <el-select
            v-model="queryFormData.state"
            placeholder="请选择防区状态"
            size="small"
            class="selectLength"
          >
            <el-option label="布防" :value="1" />
            <el-option label="撤防" :value="0" />
            <el-option label="旁路" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="queryButton">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 展示表格 -->
    <div class="exhibition">
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="defenceName" label="防区名称" width="150" />
        <el-table-column prop="defenceNumber" label="防区编号" width="300" />
        <el-table-column prop="defenceType" label="防区类型" width="100" />
        <el-table-column prop="defenceState" label="防区状态" width="100" />
        <el-table-column prop="defenceOperation" label="防区操作" width="200">
          <template #default="scope">
            <div v-if="scope.row.hasOperation">
              <el-button
                :type="scope.row.defenceOperation[2]"
                size="small"
                round
                @click="
                  operationFun(
                    scope.row.defenceOperation[0],
                    scope.row.defenceId
                  )
                "
                >{{ scope.row.defenceOperation[0] }}</el-button
              >
              <el-button
                :type="scope.row.defenceOperation[3]"
                size="small"
                round
                @click="
                  operationFun(
                    scope.row.defenceOperation[1],
                    scope.row.defenceId
                  )
                "
                >{{ scope.row.defenceOperation[1] }}</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="防区详情">
          <template #default="scope">
            <el-tag
              class="defenceDetail"
              effect="light"
              @click="planClick(scope.row.defenceNumber)"
              >防区计划
            </el-tag>
            <el-tag
              class="defenceDetail"
              effect="light"
              style="margin-left: 10px"
              @click="paramInfoClick(scope.row.defenceNumber)"
              >参数信息
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :small="true"
        :disabled="false"
        :background="true"
        layout="prev, pager, next, jumper"
        :total="totalCount"
        @current-change="handleCurrentChange"
        class="page"
      />
    </div>
  </div>
  <!-- 防区计划弹窗 -->
  <div class="defenceDetailDialog">
    <el-dialog
      v-model="planVisible"
      title="防区计划"
      width="30%"
      center
      :modal="false"
      draggable
    >
      <DefencePlanEcharts :plan="plan" :key="planKey" />
    </el-dialog>
  </div>
  <!-- 参数信息弹窗 -->
  <div class="defenceDetailDialog paramInfo">
    <el-dialog
      v-model="paramInfoVisible"
      title="参数信息"
      width="15%"
      center
      :modal="false"
      draggable
    >
      <DefenceParamDetail :params="paramsInfoData" />
    </el-dialog>
  </div>
  <!-- 防区操作弹窗 -->
  <div class="byPassDialog">
    <el-dialog
      v-model="operationVisible"
      width="20%"
      :title="'设置' + operationType"
      :modal="false"
      destroy-on-close
      draggable
    >
      <DefenceOperation
        :id="operationDefenceId"
        :type="operationType"
        @visible="
          () => {
            operationVisible = false;
          }
        "
      />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watchEffect, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import DefencePlanEcharts from "./defenceDetailComponent/DefencePlanEcharts.vue";
import DefenceParamDetail from "./defenceDetailComponent/DefenceParamDetail.vue";
import {
  getDefencePlan,
  getAssignDefence,
  getAssignCamera,
  getDefence,
} from "../server";
import type {
  DefenceGroup,
  AssignDefence,
  AssignCamera,
  DefencePlan,
  DefenceParam,
  Defence,
  Result,
} from "../serverType";
import type { DefenceInfo, TableData } from "./defenceManagement";
import { useWarnStore } from "@/stores/warnStore";
import DefenceOperation from "./defenceDetailComponent/DefenceOperation.vue";

// pinia定义告警中防区id
const warnStore = useWarnStore();

const props = defineProps<{
  group: DefenceGroup;
}>();
const defenceGroup = toRefs(props).group;

// tabel数据源（form查询结果）
const tableSource = reactive<
  {
    name: string; // 防区名称
    number: string; // 防区编号
    type: number; // 防区类型
    isWorking: boolean; // 布撤防
    isByPass: boolean; // 是否旁路
    planned: number | null; // 防区计划
    group: string; // 防区分组名称
    inputDevice: string; // 输入设备
    delayTime: number; // 延时时间
    triggerType: number; // 触发类型
    linkDefenceId: string; // 关联防区id
    linkCamera: number[]; // 联动相机
    traceCamera: number[]; // 关联相机
    linkDevice: string[]; // 联动设备
    isEfficacy: boolean; // 防区是否失效
    defenceId: number; // 防区id
  }[]
>([]);

/* -----------------查询表单部分----------------------------------- */
// 表单绑定数据
const queryFormData = reactive<{
  group?: number;
  name?: string;
  type?: number;
  state?: number;
}>({});

// 表单提交
const onSubmit = async () => {
  // 判断状态是布撤防还是旁路
  const defenceState = queryFormData.state;
  let formData: DefenceParam;
  if (defenceState === 0 || defenceState === 1) {
    // 布撤防
    formData = {
      alarmarea_group__id: queryFormData?.group,
      name: queryFormData.name,
      types: queryFormData.type,
      is_working: queryFormData.state,
      page: currentPage.value,
      page_size: pageSize.value.toString(),
    };
  } else if (defenceState === 2) {
    // 旁路
    formData = {
      alarmarea_group__id: queryFormData?.group,
      name: queryFormData.name,
      types: queryFormData.type,
      is_bypass: 1,
      page: currentPage.value,
      page_size: pageSize.value.toString(),
    };
  } else {
    // 未选择防区状态
    formData = {
      alarmarea_group__id: queryFormData?.group,
      name: queryFormData.name,
      types: queryFormData.type,
      page: currentPage.value,
      page_size: pageSize.value.toString(),
    };
  }

  try {
    const defenceData = await getDefence(formData);
    const { data, status } = defenceData;
    if (status === 200) {
      const successData = data as Defence;
      tableSource.splice(0, tableSource.length);
      successData.results.forEach((item: Result) => {
        tableSource.push({
          name: item.name,
          number: item.no,
          type: item.type,
          isWorking: item.is_working,
          isByPass: item.is_bypass,
          planned: item.planned,
          group: item.alarmarea_group_name,
          inputDevice: item.devname,
          delayTime: item.delaytime,
          triggerType: item.touch_eventflag,
          linkDefenceId: item.linkarea,
          linkCamera: item.linkcamera.map((item) => item.id),
          traceCamera: item.tracecamera,
          linkDevice: item.devgroupobj.map((item) => item.name),
          isEfficacy: item.is_failure,
          defenceId: item.id,
        });
      });
      totalCount.value = (data as Defence).count;
    } else {
      ElMessage({
        type: "error",
        message: (data as { detail: string }).detail,
      });
    }
  } catch (error) {
    console.error("分页获取防区出错" + error);
  }
};

/* ------------------数据展示table部分------------------------------------------------ */
interface TableColumn {
  defenceName: string;
  defenceNumber: string;
  defenceType: string;
  defenceState: string;
  defenceOperation: string[];
}
// 根据防区状态显示不同的背景色
const tableRowClassName = ({ row }: { row: TableColumn; rowIndex: number }) => {
  switch (row.defenceState) {
    case "布防中":
      return "working-row";
    case "已撤防":
      return "notWorking-row";
    case "已旁路":
      return "byPass-row";
    case "已失效":
      return "loseEfficacy-row";
    case "告警中":
      return "warning-row";
    default:
      break;
  }
};
// 表格数据源
const tableData = reactive<TableData>([]);

watchEffect(async () => {
  /* ------根据后端数据更新表格数据源------- */
  // 先清空table的数据源
  tableData.splice(0, tableData.length);
  tableSource.forEach((item) => {
    // 防区类型，数字转换为文字
    let type!: string;
    switch (item.type) {
      case 1:
        type = "24H防区";
        break;
      case 2:
        type = "即时防区";
        break;
      case 3:
        type = "延时防区";
        break;
      case 4:
        type = "火警防区";
        break;
      case 5:
        type = "关联防区";
        break;
      case 6:
        type = "智能防区";
        break;
      case 7:
        type = "监控区";
        break;
      default:
        break;
    }

    // 判断是否为告警中防区
    const isWarning = warnStore.warningList.some(
      (value) => value === item.defenceId
    );

    // 防区状态
    let state!: string;
    if (item.isByPass) {
      state = "已旁路";
    } else if (item.isWorking && !isWarning) {
      state = "布防中";
    } else if (!item.isWorking) {
      state = "已撤防";
    } else if (item.isEfficacy) {
      state = "已失效";
    } else if (isWarning) {
      state = "告警中";
    }

    // 当防区状态为告警中，已失效；则没有防区操作按钮
    let isOperation = true;
    if (state === "告警中" || state === "已失效") {
      isOperation = false;
    }

    // 防区操作
    let operation!: string[];
    if (item.isByPass) {
      operation = ["撤防", "恢复", "warning", "primary"];
    } else if (item.isWorking && !isWarning) {
      operation = ["撤防", "旁路", "warning", "danger"];
    } else if (!item.isWorking) {
      operation = ["布防", "旁路", "success", "danger"];
    } else if (item.isEfficacy) {
      operation = [];
    } else if (isWarning) {
      operation = [];
    }

    tableData.push({
      defenceName: item.name,
      defenceNumber: item.number,
      defenceType: type,
      defenceState: state,
      defenceOperation: operation,
      hasOperation: isOperation,
      defenceId: item.defenceId,
    });
  });
});

// 防区操作弹窗显隐
const operationVisible = ref(false);
// 防区操作类型
const operationType = ref("");
// 防区操作对应防区id
const operationDefenceId = ref(-1);
// 点击防区操作
const operationFun = (param: string, id: number) => {
  operationVisible.value = true;
  operationDefenceId.value = id;
  switch (param) {
    case "布防":
      operationType.value = "布防";
      break;
    case "撤防":
      operationType.value = "撤防";
      break;
    case "旁路":
      operationType.value = "旁路";
      break;
    default:
      break;
  }
};

/* 分页功能 */
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

const handleCurrentChange = () => {
  onSubmit();
};

/* 防区详情 */
// 防区计划弹窗显隐属性
const planVisible = ref(false);
// 防区计划弹窗key
const planKey = ref(1);
// 参数信息显隐属性
const paramInfoVisible = ref(false);

// 防区计划
const plan = reactive<
  {
    timeTag: number;
    startTime: string;
    endTime: string;
    isHas: boolean;
  }[]
>([
  {
    timeTag: -1,
    startTime: "",
    endTime: "",
    isHas: false,
  },
]);

// 参数信息
const paramsInfoData = reactive<DefenceInfo>({
  name: "", // 防区名称
  group: "", // 分组名称
  type: -1, // 防区类型
  inputDevice: "", // 输入设备
  delayTime: -1, // 延时时间
  triggerType: "", // 关联防区用到的触发类型
  linkDefence: "", // 关联防区名称
  linkCamera: [""], // 联动相机
  traceCamera: [""], // 关联相机
  linkDevice: [""], // 联动设备
});

// 防区计划点击事件
const planClick = async (param: string) => {
  planVisible.value = !planVisible.value;
  const planned = tableSource.find((item) => item.number === param)?.planned;

  planKey.value += 1;

  // 请求后端数据
  if (planned !== null && planned !== undefined) {
    plan.splice(0, plan.length);
    try {
      const planData = await getDefencePlan(planned.toString());
      const { data, status } = planData;
      if (status === 200) {
        planKey.value += 1;
        (data as DefencePlan).planneds.forEach((item) => {
          plan.push({
            timeTag: item.timetag,
            startTime: item.starttime,
            endTime: item.endtime,
            isHas: true,
          });
        });
      } else {
        ElMessage({
          type: "error",
          message: (data as { detail: string }).detail,
        });
      }
    } catch (error) {
      console.error("获取指定防区计划出错" + error);
    }
  } else {
    plan.splice(0, plan.length);
    plan.push({
      timeTag: -1,
      startTime: "",
      endTime: "",
      isHas: false,
    });
  }
};
// 参数信息点击事件
const paramInfoClick = async (defenceId: string) => {
  paramInfoVisible.value = !paramInfoVisible.value;
  const currentDefence = tableSource.find((item) => item.number === defenceId);
  if (currentDefence !== undefined) {
    paramsInfoData.name = currentDefence.name;
    paramsInfoData.group = currentDefence.group;
    paramsInfoData.inputDevice = currentDefence.inputDevice;
    paramsInfoData.delayTime = currentDefence.delayTime;
    switch (currentDefence.triggerType) {
      case 0:
        paramsInfoData.triggerType = "顺序触发";
        break;
      case 1:
        paramsInfoData.triggerType = "同时触发";
        break;
      case 2:
        paramsInfoData.triggerType = "触发时间间隔内";
        break;
      case 3:
        paramsInfoData.triggerType = "触发时间间隔外";
        break;
      default:
        break;
    }
    // 根据关联防区id获取防区名称
    const linkId = currentDefence.linkDefenceId;
    if (linkId) {
      try {
        const assignDefenceData = await getAssignDefence(linkId);
        const { data, status } = assignDefenceData;
        if (status === 200) {
          const successData = data as AssignDefence;
          paramsInfoData.linkDefence = successData.name;
        } else {
          const errorData = data as { detail: string };
          ElMessage({ type: "error", message: errorData.detail });
        }
      } catch (error) {
        console.error("获取指定防区出错" + error);
      }
    } else {
      paramsInfoData.linkDefence = "无";
    }

    /*  -------------根据相机id获取相机名称------------------------ */
    // 获取指定相机
    const getLinkCameraName = async (id: string, nameArr: string[]) => {
      try {
        const cameraData = await getAssignCamera(id);
        const { data, status } = cameraData;
        if (status === 200) {
          const successData = data as AssignCamera;
          nameArr.push(successData.name);
        } else {
          const errorData = data as { detail: string };
          ElMessage({ type: "error", message: errorData.detail });
        }
      } catch (error) {
        console.error("获取指定相机出错" + error);
      }
    };

    // 关联相机id数组
    const linkCameraArr = currentDefence.linkCamera;
    // 关联相机名称数组
    const linkCameraNameArr = reactive<string[]>([]);
    linkCameraArr.forEach((item) => {
      getLinkCameraName(item.toString(), linkCameraNameArr);
    });
    // 联动相机id数组
    const traceCameraArr = currentDefence.traceCamera;
    // 联动相机名称数组
    const traceCameraNameArr = reactive<string[]>([]);
    traceCameraArr.forEach((item) => {
      getLinkCameraName(item.toString(), traceCameraNameArr);
    });
    paramsInfoData.linkCamera = linkCameraNameArr;
    paramsInfoData.traceCamera = traceCameraNameArr;
    // 关联设置
    paramsInfoData.linkDevice = currentDefence.linkDevice;
    // 防区类型
    paramsInfoData.type = currentDefence.type;
  }
};
</script>
<style lang="less" scoped>
.defenceContent {
  color: #38c3fd;

  .query {
    height: 3.125rem;
    display: flex;
    align-items: center;
    padding-left: 1.25rem;
    background-color: #18376e;

    .form {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      ::v-deep .el-input__wrapper {
        background-color: transparent;
      }

      ::v-deep .el-input__inner {
        color: #fff;
      }
      ::v-deep .el-select__icon {
        color: #fff;
      }
      .queryButton {
        flex-grow: 1;

        ::v-deep .el-form-item__content {
          justify-content: end;
        }
      }
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }

      ::v-deep .el-form-item__label {
        color: #38c3fd;
        font-size: 0.9375rem;
      }
    }
  }

  .exhibition {
    position: relative;
    margin-top: 1.5625rem;
    padding-bottom: 3rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    background-color: #18376e;

    .page {
      position: absolute;
      right: 0.625rem;
      margin-top: 0.9375rem;
    }

    .defenceDetail {
      cursor: pointer;
    }
  }
  .selectLength {
    width: 8.125rem;
  }
}
</style>
