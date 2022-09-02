<!--
 * @Description: 
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-01 13:40:51
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-02 21:13:23
-->
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { getPngUrl } from "@/utils/index";
import type { FormInstance, FormRules } from "element-plus";

const ruleFormRef = ref<FormInstance>();

/* 验证一下添加全局方法
  import { getCurrentInstance } from "vue"; 
  const proxy =getCurrentInstance();
  proxy.$http(); */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateUserName = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  }
};

const loginForm = reactive({
  userName: "",
  password: "",
});

const rules: FormRules = reactive({
  userName: [{ validator: validateUserName, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 引入静态资源
const login_bg = getPngUrl("login_bg");

const loginBgClassStyle = reactive({
  backgroundImage: `url(${login_bg})`,
});
</script>
<template>
  <div>
    <el-row justify="center">
      <el-col :span="6">
        <div>
          <el-form
            ref="ruleFormRef"
            :model="loginForm"
            :rules="rules"
            class="demo-ruleForm"
            :style="loginBgClassStyle"
          >
            <el-form-item prop="userName">
              <el-input v-model="loginForm.userName" placeholder="用户名" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(ruleFormRef)"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="less" scoped>
// 在使用scoped的情况下，使用/deep/进行样式穿透修改
/deep/ .el-form-item__content {
  justify-content: center;
}

/deep/ .el-input__wrapper {
  width: 15rem;
  height: 2.5rem;
  border-radius: 1.25rem !important;
}

/deep/ .el-button {
  width: 9.375rem;
  height: 2.5rem;
  border: none;
  border-radius: 1.25rem;
  font-size: 16px;
  background-color: #1342a1;
}
/deep/ .el-button:hover {
  background-color: #1342a1;
}

/deep/ .el-button:focus {
  background-color: #1342a1;
}

.demo-ruleForm {
  // width: 30rem;
  height: 26.875rem;
}
</style>
