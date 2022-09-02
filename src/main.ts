import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { axios } from "./utils/axios";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "./assets/main.css";

const app = createApp(App);

app.config.globalProperties.$http = axios;

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount("#app");
