<!--
 * @Description: 登录组件
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-01 13:40:51
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-15 14:04:40
-->
<template>
  <el-row justify="center" style="height: 100%; align-content: center">
    <el-col :span="8">
      <el-form
        ref="loginFormInstance"
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
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { getPngUrl } from "@/utils/index";
import { loginHttp, type LoginData } from "./server";
import { useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

const router = useRouter();
/* form表单的引用;获取到的是el-form组件实例 */
const loginFormInstance = ref<FormInstance>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateUserName = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  }
  // el-form的验证规则中每种情况都需要调用callback函数，否则会出现调用validate不进入回调函数的情况
  callback();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  }
  callback();
};

const rules: FormRules = reactive({
  userName: [{ validator: validateUserName, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
});
/* login表单数据 */
const loginForm = reactive({
  userName: "",
  password: "",
});
/* 登录方法 */
const submitForm = () => {
  /* loginFormInstance.value引用能获取到el-form组件实例，上面有validate方法；
  这里掉一下validate的验证方法还是上面定义的rules方法；
  validate的第一个参数是boolean值，验证通过为true，未通过false；
  第二个参数是当验证未通过时，返回无效的表单；验证通过第二个参数是undefined */
  if (!loginFormInstance.value) return;
  loginFormInstance.value.validate(async (valid: boolean, invalidFields) => {
    if (valid) {
      try {
        const loginData = await loginHttp({
          username: loginForm.userName,
          password: loginForm.password,
        });
        const { data, status } = loginData;
        if (status === 200) {
          const { access, refresh } = data as LoginData;
          localStorage.setItem("Authorization", access);
          localStorage.setItem("refresh", refresh);
          // 登录成功，路由跳转
          router.push({ name: "home" });
        } else if (status === 401) {
          ElMessage({
            type: "error",
            message: "用户名或密码错误",
          });
        } else {
          const errorData = data as { detail: string };
          ElMessage({
            type: "error",
            message: errorData.detail,
          });
        }
      } catch (error) {
        console.error("登录请求出错" + error);
      }
    } else {
      console.log(invalidFields);
      return false;
    }
  });
};

// 引入静态资源,设置背景图片
const login_bg = getPngUrl("login_bg");
const loginBgClassStyle = reactive({
  backgroundImage: `url(${login_bg})`,
});
</script>

<style lang="less" scoped>
// 在使用scoped的情况下，使用/deep/进行样式穿透修改

.demo-ruleForm {
  width: 30rem;
  height: 26.875rem;
  display: flex;
  justify-content: end;
  flex-direction: column;

  /deep/ .el-form-item__content {
    justify-content: center;
  }
  /deep/ .el-input {
    width: 15rem;
  }
  /deep/.el-form-item__error {
    left: 8.75rem;
  }
  /deep/ .el-input__wrapper {
    height: 2.5rem;
    border-radius: 1.25rem;
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
}
</style>
