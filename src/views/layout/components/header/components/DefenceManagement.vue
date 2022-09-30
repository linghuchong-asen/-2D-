<!--
 * @Description: 防区管理
 * @Author: yangsen
 * @Date: 2022-09-28 11:12:20
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-30 16:51:56
-->
<template>
  <div class="defenceContent">
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
              label="南门防区"
              value="shanghai"
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
            <el-button
              :type="scope.row.defenceOperation[2]"
              size="small"
              round
              @click="operation(scope.row.defenceOperation[0])"
              >{{ scope.row.defenceOperation[0] }}</el-button
            >
            <el-button
              :type="scope.row.defenceOperation[3]"
              size="small"
              round
              @click="operation(scope.row.defenceOperation[1])"
              >{{ scope.row.defenceOperation[1] }}</el-button
            >
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
              @click="paramInfoClick"
              >参数信息
              <el-dialog
                v-model="paramInfoVisible"
                title="Warning"
                width="30%"
                center
              >
                参数详情弹窗
              </el-dialog></el-tag
            >
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
  <div class="defenceDetailDialog">
    <el-dialog
      v-model="planVisible"
      title="防区计划"
      width="30%"
      align-center
      :modal="false"
      center
    >
      <DefencePlanEcharts :plan="plan" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  reactive,
  watchEffect,
  ref,
  type Ref,
  unref,
  toRaw,
  toRefs,
} from "vue";
import IconFont from "@/utils/IconFont.vue";
import {
  getDefence,
  type DefenceParam,
  type Defence,
  type Result,
} from "../server";
import { ElMessage, menuItemEmits } from "element-plus";
import type { stringify } from "querystring";
import { isObject } from "element-plus/es/utils";
import DefencePlanEcharts from "./defenceDetailComponent/DefencePlanEcharts.vue";
import { getDefencePlan, type DefencePlan } from "../server";

const props = defineProps<{
  group: string[];
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
    planned: string | null;
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
      tableSource.splice(0, tableSource.length);
      (data as Defence).results.forEach((item: Result) => {
        tableSource.push({
          name: item.name,
          number: item.no,
          type: item.type,
          isWorking: item.is_working,
          isByPass: item.is_bypass,
          planned: item.planned,
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
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: TableColumn;
  rowIndex: number;
}) => {
  if (row.defenceState === "布防中") {
    return "working-row";
  } else if (row.defenceState === "已撤防") {
    return "notWorking-row";
  } else {
    return "byPass-row";
  }
};
// 表格数据源
const tableData = reactive<
  {
    defenceName: string;
    defenceNumber: string;
    defenceType: string;
    defenceState: string;
    defenceOperation: string[];
  }[]
>([]);
// 根据后端数据更新表格数据源
watchEffect(() => {
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
      default:
        break;
    }
    // 防区状态
    let state!: string;
    if (item.isByPass) {
      state = "已旁路";
    } else if (item.isWorking) {
      state = "布防中";
    } else if (!item.isWorking) {
      state = "已撤防";
    }
    // 防区操作
    let operation!: string[];
    if (item.isByPass) {
      operation = ["撤防", "恢复", "warning", "primary"];
    } else if (item.isWorking) {
      operation = ["撤防", "旁路", "warning", "danger"];
    } else if (!item.isWorking) {
      operation = ["布防", "旁路", "success", "danger"];
    }

    tableData.push({
      defenceName: item.name,
      defenceNumber: item.number,
      defenceType: type,
      defenceState: state,
      defenceOperation: operation,
    });
  });
});
/* 分页功能 */
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

/* 点击表格操作事件 */
const operation = (param: string) => {
  console.log(param);
  switch (param) {
    case "布防":
      break;
    case "撤防":
      break;
    case "旁路":
      break;
    case "恢复":
      break;
    default:
      break;
  }
};

const handleCurrentChange = () => {
  onSubmit();
};

/* 防区详情 */
// 防区计划弹窗显隐属性
const planVisible = ref(false);
// 参数信息显隐属性
const paramInfoVisible = ref(false);
// 防区计划
const plan = reactive<
  {
    timeTag: number;
    startTime: string;
    endTime: string;
  }[]
>([]);

// 防区计划点击事件
const planClick = async (param: string | null) => {
  planVisible.value = !planVisible.value;
  const planned = tableSource.find((item) => item.number === param)?.planned;
  // 请求后端数据
  if (typeof planned === "string") {
    try {
      const planData = await getDefencePlan(planned);
      const { data, status } = planData;
      if (status === 200) {
        (data as DefencePlan).planneds.forEach((item) => {
          plan.push({
            timeTag: item.timetag,
            startTime: item.starttime,
            endTime: item.endtimne,
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
  }
};
// 参数信息点击事件
const paramInfoClick = () => {
  paramInfoVisible.value = !paramInfoVisible.value;
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
