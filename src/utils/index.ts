import { getCurrentInstance } from "vue";

// 获取png图片
export const getPngUrl = (fileName: string) => {
  const pngUrl = new URL(`../assets/img/${fileName}.png`, import.meta.url).href;
  return pngUrl;
};
// 获取svg图片
export const getSvgUrl = (fileName: string) => {
  const svgUrl = new URL(`../assets/img/${fileName}.svg`, import.meta.url).href;
  return svgUrl;
};

// 获取全局变量
interface GlobalVar {
  $wsBaseUrl: string;
  $httpBaseUrl: string;
}
export const getGlobalVar = (): GlobalVar | undefined => {
  const instance = getCurrentInstance();
  if (instance) {
    const globalProperties = instance.appContext.config.globalProperties;
    const globalVar = globalProperties as GlobalVar;
    return globalVar;
  }
};

// ping方法
export const pingFun = (ip: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const start = new Date().getTime();
    // 尝试访问指定站点下的一个不存在的图片文件（文件名是个随机数)
    img.src = "http://" + ip + "?t=" + start;
    let flag = false; //无法访问
    img.onload = function () {
      flag = true;
      resolve(flag);
    };
    img.onerror = function () {
      flag = true;
      resolve(flag);
    };
    const timer = setTimeout(function () {
      if (!flag) {
        //如果真的无法访问
        flag = false;
        clearTimeout(timer);
        reject(flag);
      }
    }, 1500);
  });
};
