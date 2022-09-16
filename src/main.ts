import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "./assets/main.css";

const app = createApp(App);

app.config.globalProperties.$wsBaseUrl = "ws://192.168.0.100:8099";
app.config.globalProperties.$httpBaseUrl = "http://192.168.0.100:8099";
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
