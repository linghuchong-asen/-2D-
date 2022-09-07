import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [vue(), vueJsx()],
  // resolve下有resolve.alias；resolve.dedupe；resolve.conditions；resolve.mainFields；resolve.extensions；resolve.preserveSymlinks这些配置；类似于rollup的resolve配置，但是进一步进行了封装；其中alias是rollup的一个插件但是无需额外引入
  resolve: {
    alias: {
      // nodejs版本v13.2.0中，开始支持ES Modules模块规范;import.meta.url、URL和浏览器环境中作用是一致的，是在node中的实现；fileURLToPath返回完全解析的特定于平台的node.js文件路径
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // 开发服务器配置
  server: {
    hmr: { overlay: false }, // 禁用或配置 HMR 设置 server.hmr.overlay 为 false 可以禁用开发服务器错误的屏蔽。

    // port: 3000, // 类型： number 指定服务器端口;
    open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
    cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
    proxy: {
      // 类型： Record<string, string | ProxyOp 为开发服务器配置自定义代理规则
      "/bapi": {
        target: "http://192.168.0.100:8099/",
        changeOrigin: true, // 如果设置成true：发送请求头中host会设置成target;https://segmentfault.com/a/1190000020317573
        secure: false, // 默认false，设置为true，需要验证SSL证书,使用https时应该使用
        rewrite: (path) => path.replace(/^\/bapi/, ""), // rewrite 可以把请求的 URL 进行重写，这里因为假设后端的 API 路径不带 /api 段，所以我们使用 rewrite去掉 /api。给 rewrite传递一个函数，函数的参数 path是前端请求的 API 路径，后面直接使用了 replace() 方法，把 /api开头的这一段替换为空。
      },
    },
  },
});
