<template>
  <el-form
    ref="formInstance"
    :model="form"
    :rules="rules"
    class="demo-ruleForm"
  >
    <el-form-item prop="userName">
      <el-input v-model="form.userName" placeholder="用户名" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" type="password" placeholder="密码" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect, watch } from "vue";
import { type FormRules, type FormInstance, ElMessage } from "element-plus";
import { useRequest } from "@/utils/useRequest";
import { useUserStore } from "@/stores/userStore";
import type { SetRelieveParams, SetRelieveData } from "../serverType";
import { setRelieve } from "../server";

const emit = defineEmits<{ e: "visible" }>();

const userStore = useUserStore();

// 表单实例
const formInstance = ref<FormInstance>();

const rules: FormRules = reactive({
  userName: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  password: [{ required: true, message: "此项为必填项", trigger: "blur" }],
});

/* 表单绑定数据 */
const form = reactive({
  userName: "",
  password: "",
});

// 表单提交数据
const formSubmit = reactive<{
  FromUsername: string;
  ToUsername: string;
  FromPassword: string;
  ToPassword: string;
}>({
  FromUsername: "",
  ToUsername: "",
  FromPassword: "",
  ToPassword: "",
});

// 表单提交事件
const submitForm = () => {
  if (!formInstance.value) {
    return;
  } else {
    formInstance.value.validate((valid) => {
      // 配置提交数据
      formSubmit.FromUsername = userStore.user.userName;
      formSubmit.FromPassword = userStore.user.password;
      formSubmit.ToUsername = form.userName;
      formSubmit.ToPassword = form.password;

      if (valid) {
        const data = useRequest<SetRelieveData, SetRelieveParams>(
          setRelieve,
          formSubmit
        );
      } else {
        ElMessage({ type: "error", message: "表单校验失败" });
      }
    });
  }
};
</script>
<style lang="less" scoped></style>
