/*
 * @Description:公共用的方法
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-16 19:28:31
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-21 17:42:56
 */

// 颜色转换rgb转十六进制
export function rgbaToHexColor(rgbaArray, alphaMaxVal = 1) {
  //补位警号
  return (
    "#" +
    rgbaArray
      .map((chanel, index) => {
        let hexNum = "";
        if (index === 3) {
          //这是alpha通道
          hexNum = Number(Math.round((chanel * 255) / alphaMaxVal)).toString(
            16
          );
        } else {
          //普通通道直接转换
          hexNum = Number(chanel).toString(16);
        }
        return hexNum.length === 1 ? "0" + hexNum : hexNum; //这里解决了部分通道数字小于10的情况进行补位
      })
      .join("")
  );
}
