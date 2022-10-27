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

// 格式化时间 格式：yyyy-mm-dd hh:mm:ss
export const getFormateTime = (time?: number): string => {
  // 有参数时，获取参数的时间；没有时获取当前时间
  let date;
  if (time) {
    date = new Date(time);
  } else {
    date = new Date();
  }
  // 获取年
  const year: string = date.getFullYear().toString();
  // 获取月
  let month: string = date.getMonth().toString();
  // 获取日
  let day: string = date.getDate().toString();
  // 获取时
  let hour: string = date.getHours().toString();
  // 获取分钟
  let minute: string = date.getMinutes().toString();
  // 获取秒
  let second: string = date.getSeconds().toString();

  month =
    parseInt(month) < 9 ? "0" + (month + 1) : (parseInt(month) + 1).toString();
  day = parseInt(day) < 10 ? "0" + day : day;
  hour = parseInt(hour) < 10 ? "0" + hour : hour;
  minute = parseInt(minute) < 10 ? "0" + minute : minute;
  second = parseInt(second) < 10 ? "0" + second : second;

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
};

// 获取n个小时后的时间，并格式化
export const getHoursAfter = (hours: number) => {
  const dateNow = new Date();
  // 当前时间戳
  const timestamp = dateNow.getTime();
  // n小时后毫秒数
  const milliSecond = timestamp + hours * 60 * 60 * 1000;
  // 调用格式化函数
  return getFormateTime(milliSecond);
};

// 格式化时间 格式：yyyy-mm-ddThh:mm:ss
export const getFormateTimeT = (time?: number): string => {
  // 有参数时，获取参数的时间；没有时获取当前时间
  let date;
  if (time) {
    date = new Date(time);
  } else {
    date = new Date();
  }
  // 获取年
  const year: string = date.getFullYear().toString();
  // 获取月
  let month: string = date.getMonth().toString();
  // 获取日
  let day: string = date.getDate().toString();
  // 获取时
  let hour: string = date.getHours().toString();
  // 获取分钟
  let minute: string = date.getMinutes().toString();
  // 获取秒
  let second: string = date.getSeconds().toString();

  month =
    parseInt(month) < 9 ? "0" + (month + 1) : (parseInt(month) + 1).toString();
  day = parseInt(day) < 10 ? "0" + day : day;
  hour = parseInt(hour) < 10 ? "0" + hour : hour;
  minute = parseInt(minute) < 10 ? "0" + minute : minute;
  second = parseInt(second) < 10 ? "0" + second : second;

  return (
    year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second
  );
};

// 获取指定时间(yyyy-mm-dd hh:mm:ss)；n秒前或者后的时间，并格式化yyyy-mm-ddThh:mm:ss
export const getAssignAfter = (time: string, seconds: number) => {
  const dateNow = new Date(time);
  // 当前时间戳
  const timestamp = dateNow.getTime();

  // n小时后毫秒数
  const milliSecond = timestamp + seconds * 1000;

  // 调用格式化函数
  return getFormateTimeT(milliSecond);
};
