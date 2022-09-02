// 获取png图片
export const getPngUrl = (fileName: string) => {
  const pngUrl = new URL(`../assets/img/${fileName}.png`, import.meta.url).href;
  return pngUrl;
};
