/*
 * @Description:公共用的方法
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-16 19:28:31
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-16 19:31:13
 */

// 颜色转换rgb转十六进制
function rgbaToHexColor(rgbaArray, alphaMaxVal = 1) {
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

//防区填充色
function getDrawPolygonFillColor(working, delay, bypass, isfailure) {
  if (isfailure) {
    //  失效
    return "rgba(225, 26, 26, 0.12)";
  } else if (bypass) {
    //  旁路
    return "rgba(255, 0, 0, 0.12)";
  } else if (!working) {
    //撤防中  1、布防 2、撤防
    return "rgba(0, 0, 0, 0.12)";
  } else if (delay == 0) {
    //即时防区
    return "rgba(0, 255, 126, 0.12)";
  } else if (delay == 1) {
    //延时防区
    return "rgba(225, 225, 0, 0.12)";
  }
  return "rgba(0, 0, 0, 1)";
}

//防区边框色
function getDrawPolygonStrokeColor(working, delay, bypass, isfailure) {
  if (isfailure) {
    //  失效
    return "rgba(225, 26, 26, 0.3)";
  } else if (bypass) {
    //  旁路
    return "rgba(255, 0, 0, 0.3)";
  } else if (!working) {
    //撤防中  1、布防 2、撤防
    return "rgba(0, 0, 0, 0.3)";
  } else if (delay == 0) {
    //即时防区
    return "rgba(0, 255, 126, 0.3)";
  } else if (delay == 1) {
    //延时防区
    return "rgba(225, 225, 0, 0.3)";
  }
  return "rgba(0, 0, 0, 1)";
}
