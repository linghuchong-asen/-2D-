<template>
  <el-row>
    <!-- 左侧表单 -->
    <el-col :span="8">
      <el-tabs type="card" stretch @tab-change="tabChange">
        <el-tab-pane label="操作记录">
          <el-form :model="operationQueryForm" style="max-width: 280px">
            <el-form-item label="操作类型:">
              <el-select
                v-model="operationQueryForm.type"
                placeholder="请选择操作类型"
                size="small"
              >
                <el-option label="全部" value="全部" />
                <el-option label="防区" value="防区" />
                <el-option label="防区分组" value="防区分组" />
                <el-option label="防区计划" value="防区计划" />
              </el-select>
            </el-form-item>
            <el-form-item label="操作用户:">
              <el-input
                v-model="operationQueryForm.name"
                placeholder="请输入用户名"
              />
            </el-form-item>

            <el-form-item label="开始时间">
              <el-date-picker
                v-model="operationQueryForm.startTime"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="operationQueryForm.endTime"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item class="queryButton">
              <el-button type="primary" @click="operationSubmit"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="交班记录">
          <el-form :model="relieveQueryForm">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="relieveQueryForm.startTime"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="relieveQueryForm.endTime"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item class="queryButton">
              <el-button type="primary" @click="relieveSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <!-- 中间的样式条 -->
    <el-col class="middle" :span="1"></el-col>

    <!-- 右侧列表 -->
    <el-col :span="15">
      <div class="list">
        <!-- 操作记录 -->
        <div v-if="isOperation">
          <div v-if="operationResult.length !== 0">
            <el-descriptions
              v-for="(item, index) in operationResult"
              :key="index"
              :column="24"
            >
              <el-descriptions-item label="编号:" :span="4" :min-width="100">{{
                item.id
              }}</el-descriptions-item>
              <el-descriptions-item
                label="用户名:"
                :span="10"
                :min-width="150"
                >{{ item.username }}</el-descriptions-item
              >
              <el-descriptions-item
                label="操作类型:"
                :span="10"
                :min-width="150"
                >{{ item.operation_category }}</el-descriptions-item
              >
              <el-descriptions-item label="描述:" :span="12">
                {{ item.operation_action }}
              </el-descriptions-item>
              <el-descriptions-item label="时间" :span="12">{{
                item.operation_time
              }}</el-descriptions-item>
            </el-descriptions>
            <el-pagination
              v-model:currentPage="operationCurrentPage"
              v-model:page-size="pageSize"
              :small="true"
              :disabled="false"
              :background="true"
              layout="prev, pager, next, jumper"
              :total="oprationCount"
              @current-change="operationChangePage"
              v-if="pageVisible"
            />
          </div>
          <div v-else style="color: #97d0f6; font-size: 22px">暂无无数据</div>
        </div>
        <!-- 交接班记录 -->
        <div v-if="isRelieve">
          <div v-if="relieveResult.length !== 0">
            <el-descriptions
              v-for="(item, index) in relieveResult"
              :key="index"
              :column="24"
            >
              <el-descriptions-item label="编号:" :span="3">{{
                item.id
              }}</el-descriptions-item>
              <el-descriptions-item label="交班用户名:" :span="5">{{
                item.from_username
              }}</el-descriptions-item>
              <el-descriptions-item label="接班用户名:" :span="5">{{
                item.to_username
              }}</el-descriptions-item>
              <el-descriptions-item label="交接班时间:" :span="11">
                {{ item.timestamp }}
              </el-descriptions-item>
            </el-descriptions>
            <el-pagination
              v-model:currentPage="relieveCurrentPage"
              v-model:page-size="pageSize"
              :small="true"
              :disabled="false"
              :background="true"
              layout="prev, pager, next, jumper"
              :total="relieveCount"
              @current-change="relieveChangePage"
              v-if="pageVisible"
            />
          </div>
          <div v-else style="color: #97d0f6; font-size: 22px">暂无无数据</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import type {
  OperationQueryForm,
  RelieveQueryForm,
  OperationQueryData,
} from "./operationLog";
import { useRequest } from "@/utils/useRequest";
import { getOperationLog, getRelieLog } from "../server";
import type {
  OperationLogParams,
  OperationLogResult,
  OperationLogData,
  RelieveParams,
  RelieResult,
  RelieData,
} from "../serverType";

// pageSize容量
const pageSize = ref<number>(6);
// 操作日志当前页
const operationCurrentPage = ref<number>(1);
// 交接班日志记录
const relieveCurrentPage = ref<number>(1);

/* -------------操作日志------------------- */
// 是否展示操作日志信息
const isOperation = ref<boolean>(false);
// 操作日志表单绑定数据
const operationQueryForm = reactive<OperationQueryForm>({});
// 操作日志表单提交数据
const operationQueryData = reactive<OperationQueryData>({
  page: operationCurrentPage.value,
  page_size: pageSize.value,
});
// 操作日志列表数据源
const operationResult = reactive<OperationLogResult>([]);

// 操作日志发送请求函数
const operationRequestFun = () => {
  operationResult.splice(0, operationResult.length);

  const data = useRequest<OperationLogData, OperationLogParams>(
    getOperationLog,
    operationQueryData
  );
  watch(data, () => {
    if (data.value !== undefined) {
      data.value.results.forEach((item) => {
        operationResult.push(item);
      });

      oprationCount.value = data.value.count;
    }
  });
};

// 操作日志表单提交
const operationSubmit = () => {
  isOperation.value = true;
  isRelieve.value = false;
  pageVisible.value = true;

  // 配置提交数据
  switch (operationQueryForm.type) {
    case "防区":
      operationQueryData.operation_category = "防区";
      break;
    case "防区分组":
      operationQueryData.operation_category = "防区分组";
      break;
    case "防区计划":
      operationQueryData.operation_category = "防区计划";
      break;
    default:
      break;
  }
  if (operationQueryForm.startTime && operationQueryForm.endTime)
    operationQueryData.startdatetime = [
      operationQueryForm.startTime,
      operationQueryForm.endTime,
    ];

  // 提交表单
  operationRequestFun();
};

/* ------------交班日志----------------------- */
// 是否展示交班信息
const isRelieve = ref<boolean>(false);
// 交接班form绑定数据
const relieveQueryForm = reactive<RelieveQueryForm>({});

// 交接班表单提交数据
const relieveQueryData = reactive<RelieveParams>({
  page: relieveCurrentPage.value,
  page_size: pageSize.value,
});

// 交接班列表数据
const relieveResult = reactive<RelieResult>([]);

// 交接班发送请求函数
const relieveRequestFun = () => {
  relieveResult.splice(0, relieveResult.length);

  const data = useRequest<RelieData, RelieveParams>(
    getRelieLog,
    relieveQueryData
  );

  watch(data, () => {
    if (data.value !== undefined) {
      data.value.results.forEach((item) => {
        relieveResult.push(item);
      });
      relieveCount.value = data.value.count;
    }
  });
};

// 交接班表单提交
const relieveSubmit = () => {
  isOperation.value = false;
  isRelieve.value = true;
  pageVisible.value = true;

  // 配置表单项
  if (relieveQueryForm.startTime)
    relieveQueryData.StartDateTime = relieveQueryForm.startTime;
  if (relieveQueryForm.endTime)
    relieveQueryData.EndDateTime = relieveQueryForm.endTime;

  relieveRequestFun();
};

/* -------------页码-------------------- */

// 页码显示隐藏
const pageVisible = ref<boolean>(false);
// 操作日志总数
const oprationCount = ref<number>(0);
// 交接班日志总数
const relieveCount = ref<number>(0);
// 操作日志改变页码事件
const operationChangePage = () => {
  operationQueryData.page = operationCurrentPage.value;
  operationRequestFun();
};
// 交接班改变页码事件
const relieveChangePage = () => {
  relieveQueryData.page = relieveCurrentPage.value;
  relieveRequestFun();
};

/* -----切换tab页----- */
const tabChange = () => {
  isRelieve.value = false;
  isOperation.value = false;
};
</script>
<style lang="less" scoped></style>
