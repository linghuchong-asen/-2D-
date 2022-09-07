import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/components/login/LoginPage.vue";
import LayoutIndex from "@/views/layout/LayoutIndex.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: LayoutIndex,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
  ],
});

/* 路由导航守卫 */
router.beforeEach(async (to) => {
  const isAuthenticated = window.sessionStorage.getItem("token");
  if (
    // 检查用户是否已登录
    !isAuthenticated &&
    // ❗️ 避免无限重定向
    to.name !== "login"
  ) {
    // 将用户重定向到登录页面
    return { name: "login" };
  }
});

export default router;
