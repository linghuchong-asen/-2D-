<template>
  <div v-if="type === '旁路'" class="byPass">
    <el-form :model="byPassData" ref="byPassInstance" :rules="byPassRule">
      <el-form-item label="旁路时长: " prop="time">
        <el-select v-model="byPassData.time" placeholder="请选择旁路时间">
          <el-option
            v-for="(item, index) in byPassTime"
            :key="index"
            :label="item + '小时'"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- el-form-item的prop属性，要和v-model绑定的值保持一致，不然规则验证会报此项未输入内容的错误 -->
      <el-form-item label="操作密码: " prop="passWord">
        <el-input
          v-model="byPassData.passWord"
          type="password"
          placeholder="请输入操作密码"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="byPassSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-if="type === '撤防'">
    <el-form :model="withdrawData" ref="withdrawInstance" :rules="withdrawRule">
      <el-form-item label="布防计划: " prop="plane">
        <el-radio-group v-model="withdrawData.plane" class="ml-4">
          <el-radio :label="false" size="large">不覆盖</el-radio>
          <el-radio :label="true" size="large">覆盖</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- el-form-item的prop属性，要和v-model绑定的值保持一致，不然规则验证会报此项未输入内容的错误 -->
      <el-form-item label="操作密码: " prop="passWord">
        <el-input
          v-model="withdrawData.passWord"
          type="password"
          placeholder="请输入操作密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="withdrawSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-if="type === '布防'">
    <el-form :model="deployData" ref="deployInstance" :rules="deployRule">
      <el-form-item label="布防计划: " prop="plane">
        <el-radio-group v-model="deployData.plane" class="ml-4">
          <el-radio :label="false" size="large">不覆盖</el-radio>
          <el-radio :label="true" size="large">覆盖</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- el-form-item的prop属性，要和v-model绑定的值保持一致，不然规则验证会报此项未输入内容的错误 -->
      <el-form-item label="操作密码: " prop="passWord">
        <el-input
          v-model="deployData.passWord"
          type="password"
          placeholder="请输入操作密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deploySubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { setByPass, setClothRemoval } from "../../server";
import type { ByPassParams, ClothRemovalParams } from "../../serverType";
import { getFormateTime, getHoursAfter } from "@/utils/index";
import { useRequest } from "@/utils/useRequest";

const props = defineProps<{
  type: string;
  id: number; // 防区id
}>();

const defenceId = toRefs(props).id;

const emit = defineEmits<{ (e: "visible"): void }>();

/* ----------旁路----------- */

// 旁路表单数据对象
const byPassData = reactive<{
  time?: number;
  passWord?: string;
}>({});

// 设置旁路表单数据
const byPassForm = reactive<ByPassParams>({
  id: -1,
  bypassEnd: "",
  bypassStart: "",
  isBypass: true,
  password: "",
});

// 旁路时长的选择
const byPassTime = [1, 2, 4, 8, 12, 24, 48];

// 表单实例
const byPassInstance = ref<FormInstance>();

// 旁路表单规则
const byPassRule = {
  time: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  passWord: [{ required: true, message: "此项为必填项", trigger: "blur" }],
};

// 旁路表单提交
const byPassSubmit = () => {
  if (!byPassInstance.value) {
    return;
  } else {
    byPassInstance.value.validate(async (valid, invalidFields) => {
      if (valid && byPassData.time && byPassData.passWord) {
        // 获取当前时间
        const startTime = getFormateTime();
        // 计算结束时间
        const endTime = getHoursAfter(byPassData.time);
        // 配置提交表单内容
        byPassForm.id = defenceId.value;
        byPassForm.bypassStart = startTime;
        byPassForm.bypassEnd = endTime;
        byPassForm.password = byPassData.passWord;

        // 发送请求
        try {
          const passData = await setByPass(byPassForm);
          const { data, status } = passData;
          if (status === 200) {
            ElMessage({ type: "success", message: "设置旁路成功" });
            emit("visible");
          } else {
            ElMessage({
              type: "error",
              message: (data as { detail: string }).detail,
            });
          }
        } catch (error) {
          console.error("设置旁路请求出错" + error);
        }
      } else {
        console.error("设置旁路表单校验失败" + invalidFields);
        console.log(invalidFields);
      }
    });
  }
};

/* --------------撤防------------------- */

// 撤防表单绑定对象
const withdrawData = reactive<{
  plane: boolean;
  passWord: string;
}>({ plane: false, passWord: "" });

// 撤防提交数据
const withdrawForm = reactive<ClothRemovalParams>({
  id: -1,
  is_cover: false,
  is_working: false,
  password: "",
});

// 撤防表单实例
const withdrawInstance = ref<FormInstance>();

// 撤防表单规则
const withdrawRule = {
  time: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  passWord: [{ required: true, message: "此项为必填项", trigger: "blur" }],
};

// 撤防成功提示
const withdrawMessage = ref<boolean>(false);

// 撤防表单提交事件
const withdrawSubmit = () => {
  if (!withdrawInstance.value) {
    return;
  } else {
    withdrawInstance.value.validate((valid) => {
      // 配置提交数据
      withdrawForm.id = defenceId.value;
      withdrawForm.is_cover = withdrawData.plane;
      withdrawForm.is_working = false;
      withdrawForm.password = withdrawData.passWord;

      if (valid) {
        const data = useRequest(setClothRemoval, withdrawForm);
        watch(data, () => {
          if (data.value !== undefined) {
            withdrawMessage.value = true;
            emit("visible");
          }
        });
      } else {
        ElMessage({ type: "error", message: "表演校验未通过" });
      }
    });
  }
};

watch(withdrawMessage, () => {
  ElMessage({ type: "success", message: "布防成功" });
});

/* --------------------布防--------------------- */

// 布防表单绑定对象
const deployData = reactive<{
  plane: boolean;
  passWord: string;
}>({ plane: false, passWord: "" });

// 布防提交数据
const deployForm = reactive<ClothRemovalParams>({
  id: -1,
  is_cover: false,
  is_working: false,
  password: "",
});

// 布防表单实例
const deployInstance = ref<FormInstance>();

// 布防表单规则
const deployRule = {
  time: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  passWord: [{ required: true, message: "此项为必填项", trigger: "blur" }],
};

// 布防成功提示
const deployMessage = ref<boolean>(false);

// 布防表单提交事件
const deploySubmit = () => {
  if (!deployInstance.value) {
    return;
  } else {
    deployInstance.value.validate((valid) => {
      // 配置提交数据
      deployForm.id = defenceId.value;
      deployForm.is_cover = deployData.plane;
      deployForm.is_working = true;
      deployForm.password = deployData.passWord;

      if (valid) {
        const data = useRequest(setClothRemoval, deployForm);
        watch(data, () => {
          if (data.value !== undefined) {
            deployMessage.value = true;
            emit("visible");
          }
        });
      } else {
        ElMessage({ type: "error", message: "表演校验未通过" });
      }
    });
  }
};

watch(deployMessage, () => {
  ElMessage({ type: "success", message: "布防成功" });
});
</script>
<style lang="less" scoped></style>
