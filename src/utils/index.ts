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
