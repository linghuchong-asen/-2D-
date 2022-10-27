/*
 * @Description:openlayers的操作方法（地图相关）
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-16 19:28:31
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-25 11:48:19
 */
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { defaults } from "ol/control/defaults";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import ScaleLine from "ol/control/ScaleLine";
import Rotate from "ol/control/Rotate";
import { transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import * as olSource from "ol/source";
import Polygon from "ol/geom/Polygon";
import * as olProj from "ol/proj";
import LineString from "ol/geom/LineString";
import Overlay from "ol/Overlay";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import CircleStyle from "ol/style/Circle";

let map;

// 在线高德地图
const mlayer = new TileLayer({
  projection: "EPSG:4326",
  source: new XYZ({
    url: "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  }),
  name: "在线高德影像地图",
});

//openlayer的图层
const trgtLineSource = new olSource.Vector();
const trgtLineLayer = new VectorLayer({
  // 所有轨迹线放到一个组中
  source: trgtLineSource,
  style: [
    new Style({
      stroke: new Stroke({
        color: "#ff0000",
        width: 2,
      }),
    }),
  ],
});

const trgtptSources = new olSource.Vector(); //所有目标放到一个组中
// 目标轨迹的图层
const trgtptLayer = new VectorLayer({
  source: trgtptSources,
});

// 轨迹线的图标
const trgtImgsrc = "/image/alarm_yuan.png";

//离线图层:引用本地图片
const offlineMapLayer = new TileLayer({
  projection: "EPSG:4326",
  // source: new XYZ({ url: "./tiles2/{z}/{x}/{y}.png" }),
});

// 引用服务上的地图
const localSeverSource = new XYZ({
  tileUrlFunction: function (coordinate) {
    const z = coordinate[0] - 1;
    const x = coordinate[1];
    const y = coordinate[2];
    return "http://192.168.0.100:8889/boao&x=" + x + "&y=" + y + "&z=" + z;
  },
  maxZoom: 18,
  minZoom: 2,
  projection: "EPSG:4326",
});
const localSeverMap = new TileLayer({
  name: "本地服务器瓦片地图",
  source: localSeverSource,
});

//比例尺
const scaleLineControl = new ScaleLine({
  //设置度量单位为米
  units: "metric",
  target: "scalebar",
  className: "ol-scale-line",
});

//旋转控件
const ratate = new Rotate({
  autoHide: false,
});

//设置中心点:窗口中心定位到目标点
export function setMapCenterPoint(point) {
  map.getView().setCenter(transform(point, "EPSG:4326", "EPSG:3857"));
}

//设置层级：瓦片地图的层级
function setMapZoom(zoom) {
  map.getView().setZoom(zoom);
}

// 离线地图
const offlineMap = new TileLayer({
  name: "离线高德影像地图",
  source: offlineMapLayer,
});

// 初始化map
export const initMap = () => {
  /* 涉及到dom挂载的都放到initMap中 */
  //初始化map
  map = new Map({
    controls: defaults({
      attribution: false,
      zoom: false,
      rotate: false,
    }),
    target: "map",
    view: new View({
      center: olProj.fromLonLat([116.613874, 40.028711]),
      zoom: 18,
    }),
  });

  // 加载图层
  map.addLayer(mlayer);

  // map.addLayer(offlineMap);

  // 瓦片地图
  map.addLayer(localSeverMap);

  //鼠标点的经纬度
  const mousePositionControl = new MousePosition({
    //样式类名称
    className: "mosuePosition",
    //投影坐标格式，显示小数点后边多少位
    coordinateFormat: createStringXY(8),
    //指定投影
    projection: "EPSG:4326",
    //目标容器
    target: document.getElementById("myposition"),
  });
  map.addControl(mousePositionControl);

  map.addControl(scaleLineControl);

  //map.addControl(ratate);

  map.addLayer(trgtLineLayer);

  map.addLayer(trgtptLayer);

  let tip_message_flag = true; // 有无弹窗的标识
  //弹窗；实况视频哪些属性信息；openLayers地图中的弹窗
  const overlay = new Overlay({
    element: document.getElementById("popup"), //设置弹出框的容器
    autoPan: true, //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
    autoPanAnimation: {
      duration: 250,
    },
  });
  // 添加弹窗图层
  map.addOverlay(overlay);
  // 地图的点击事件
  map.on("click", function (e) {
    if (tip_message_flag) {
      // 点击地图中的位置相对的窗口
      const pixel = map.getEventPixel(e.originalEvent);
      map.forEachFeatureAtPixel(pixel, function (feature) {
        // 获取id
        const getid = feature.getId();
        console.log(getid);
        if (getid == null) {
          return;
        } else if (getid.indexOf("element") > -1) {
          // 当要素重叠点击时，显示最后一个
          document.getElementById("popup-content").innerHTML = `
                <p><span class="p_realtime">实况视频</span></p>
                <p><span class="p_history">历史回放</span></p>
                <p><span class="p_proprety">属性信息</span></p>
                `;
          // 点击的地图的位置
          const coodinate = e.coordinate;
          // 弹窗的位置
          overlay.setPosition(coodinate);
          tip_message_flag = false;
        }
      });
    }
  });

  document.addEventListener("click", function () {
    if (tip_message_flag) {
      // 通过给位置一个undefined来让弹窗不显示在窗口
      overlay.setPosition(undefined);
      return false;
    }
    tip_message_flag = true;
  });

  return map;

  //测距 ranging
  /* 官网案例：https://openlayers.org/en/latest/examples/measure.html */
  // function ranging() {
  //   map.removeInteraction(draw_ranging); //移除绘制图形
  //   const key = map.on("pointermove", pointerMoveHandler);
  //   Observable.unByKey(key);
  //   map.on("pointermove", pointerMoveHandler);
  //   addInteraction_ranging("line");
  // }

  // function rangingArea() {
  //   map.removeInteraction(draw_ranging); //移除绘制图形
  //   const key = map.on("pointermove", pointerMoveHandler);
  //   Observable.unByKey(key);
  //   map.on("pointermove", pointerMoveHandler);
  //   addInteraction_ranging("area");
  // }

  // let draw_ranging;
  // (function () {
  //   const source_ranging = new olSource.Vector(); //图层数据源
  //   const vector_ranging = new VectorLayer({
  //     source: source_ranging,
  //     style: new Style({
  //       fill: new Fill({
  //         color: "rgba(255,15,200,0.2)",
  //       }),
  //       stroke: new Stroke({
  //         color: "#f2412e",
  //         width: 3,
  //       }),
  //       image: new Circle({
  //         radius: 7,
  //         fill: new Fill({
  //           color: "#ff09f1",
  //         }),
  //       }),
  //     }),
  //   });
  //   map.addLayer(vector_ranging);

  //   $(".ranging").click(function () {
  //     map.removeInteraction(draw_ranging); //移除绘制图形
  //     const key = map.on("pointermove", pointerMoveHandler);
  //     Observable.unByKey(key);
  //     map.on("pointermove", pointerMoveHandler);
  //     addInteraction_ranging("line");
  //   });

  //   document.getElementsByClassName(".ranging_area")[0].click(function () {
  //     map.removeInteraction(draw_ranging); //移除绘制图形
  //     const key = map.on("pointermove", pointerMoveHandler);
  //     Observable.unByKey(key);
  //     map.on("pointermove", pointerMoveHandler);
  //     addInteraction_ranging("area");
  //   });

  //   /**
  //    * 加载交互绘制控件函数
  //    */
  //   let sketch;
  //   let helpTooltip;
  //   let helpTooltipElement;
  //   let measureTooltipElement;
  //   /**
  //    * 鼠标移动事件处理函数
  //    * @param {ol.MapBrowserEvent} evt
  //    */
  //   const pointerMoveHandler = function (evt) {
  //     if (evt.dragging) {
  //       return;
  //     }
  //     /** @type {string} */
  //     let helpMsg = "开始绘制"; //当前默认提示信息
  //     //判断绘制几何类型设置相应的帮助提示信息
  //     if (sketch) {
  //       const geom = sketch.getGeometry();
  //       if (geom instanceof Polygon) {
  //         helpMsg = continuePolygonMsg; //绘制多边形时提示相应内容
  //       } else if (geom instanceof LineString) {
  //         helpMsg = continueLineMsg; //绘制线时提示相应内容
  //       }
  //     }
  //     helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
  //     helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
  //     $(helpTooltipElement).addClass("tooltip_help");
  //     $(helpTooltipElement).removeClass("hidden"); //移除帮助提示框的隐藏样式进行显示
  //   };
  //   function addInteraction_ranging(type) {
  //     type = type == "area" ? "Polygon" : "LineString";
  //     draw_ranging = new Draw({
  //       source: source_ranging, //测量绘制层数据源
  //       type: /** @type {ol.geom.GeometryType} */ (type), //几何图形类型
  //       style: new Style({
  //         //绘制几何图形的样式
  //         fill: new Fill({
  //           color: "rgba(255, 255, 255, 0.2)",
  //         }),
  //         stroke: new Stroke({
  //           color: "rgba(255, 0, 0, 0.5)",
  //           lineDash: [10, 10],
  //           width: 2,
  //         }),
  //         image: new Circle({
  //           radius: 5,
  //           stroke: new Stroke({
  //             color: "rgba(0, 0, 0, 0.7)",
  //           }),
  //           fill: new Fill({
  //             color: "rgba(255, 255, 255, 0.2)",
  //           }),
  //         }),
  //       }),
  //     });
  //     map.addInteraction(draw_ranging);
  //     createMeasureTooltip(); //创建测量工具提示框
  //     createHelpTooltip(); //创建帮助提示框
  //     let listener;
  //     //绑定交互绘制工具开始绘制的事件
  //     draw_ranging.on(
  //       "drawstart",
  //       function (evt) {
  //         // set sketch
  //         sketch = evt.feature; //绘制的要素

  //         /** @type {ol.Coordinate|undefined} */
  //         let tooltipCoord = evt.coordinate; // 绘制的坐标
  //         //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
  //         listener = sketch.getGeometry().on("change", function (evt) {
  //           const geom = evt.target; //绘制几何要素
  //           let output;
  //           if (geom instanceof ol.geom.Polygon) {
  //             output = formatArea(/** @type {ol.geom.Polygon} */ (geom)); //面积值
  //             tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
  //           } else if (geom instanceof LineString) {
  //             output = formatLength(/** @type {ol.geom.LineString} */ (geom)); //长度值
  //             tooltipCoord = geom.getLastCoordinate(); //坐标
  //           }
  //           measureTooltipElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
  //           measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
  //         });
  //       },
  //       this
  //     );
  //     //绑定交互绘制工具结束绘制的事件
  //     draw_ranging.on(
  //       "drawend",
  //       function (evt) {
  //         measureTooltipElement.className = "tooltip tooltip-static"; //设置测量提示框的样式
  //         measureTooltip.setOffset([0, -7]);
  //         // unset sketch
  //         sketch = null; //置空当前绘制的要素对象
  //         // unset tooltip so that a new one can be created
  //         measureTooltipElement = null; //置空测量工具提示框对象
  //         createMeasureTooltip(); //重新创建一个测试工具提示框显示结果
  //         $(".tooltip-static").append('<i class="clear_ranging_line"></i>');
  //         Observable.unByKey(listener);
  //         map.removeInteraction(draw_ranging);
  //         map.removeEventListener("pointermove");
  //         $(".clear_ranging_line").click(function () {
  //           //vector_ranging.getSource().removeFeature(evt.feature)
  //           vector_ranging.getSource().clear();
  //           $(".ol-overlay-container").hide();
  //         });
  //       },
  //       this
  //     );
  //   }
  //   const wgs84Sphere = new ol.Sphere(6378137);
  //   function createHelpTooltip() {
  //     if (helpTooltipElement) {
  //       helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  //     }
  //     helpTooltipElement = document.createElement("div");
  //     helpTooltipElement.className = "tooltip hidden";
  //     helpTooltip = new Overlay({
  //       element: helpTooltipElement,
  //       offset: [15, 0],
  //       positioning: "center-left",
  //     });
  //     map.addOverlay(helpTooltip);
  //   }
  //   /**
  //    *创建一个新的测量工具提示框（tooltip）
  //    */
  //   function createMeasureTooltip() {
  //     if (measureTooltipElement) {
  //       measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  //     }
  //     measureTooltipElement = document.createElement("div");
  //     measureTooltipElement.className = "tooltip tooltip-measure";
  //     const measureTooltip = new Overlay({
  //       element: measureTooltipElement,
  //       offset: [0, -15],
  //       positioning: "bottom-center",
  //     });
  //     map.addOverlay(measureTooltip);
  //   }
  //   /**
  //    * 测量长度输出
  //    * @param {ol.geom.LineString} line
  //    * @return {string}
  //    */
  //   const formatLength = function (line) {
  //     let length;

  //     //若使用测地学方法测量
  //     const coordinates = line.getCoordinates(); //解析线的坐标
  //     length = 0;
  //     const sourceProj = map.getView().getProjection(); //地图数据源投影坐标系
  //     //通过遍历坐标计算两点之前距离，进而得到整条线的长度
  //     for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
  //       const c1 = transform(coordinates[i], sourceProj, "EPSG:4326");
  //       const c2 = transform(coordinates[i + 1], sourceProj, "EPSG:4326");
  //       length += wgs84Sphere.haversineDistance(c1, c2);
  //     }

  //     let output;
  //     if (length > 100) {
  //       output = Math.round((length / 1000) * 100) / 100 + " " + "km"; //换算成KM单位
  //     } else {
  //       output = Math.round(length * 100) / 100 + " " + "m"; //m为单位
  //     }
  //     return output; //返回线的长度
  //   };
  //   /**
  //    * 测量面积输出
  //    * @param {ol.geom.Polygon} polygon
  //    * @return {string}
  //    */
  //   const formatArea = function (polygon) {
  //     //若使用测地学方法测量
  //     const sourceProj = map.getView().getProjection(); //地图数据源投影坐标系
  //     const geom = /** @type {ol.geom.Polygon} */ (
  //       polygon.clone().transform(sourceProj, "EPSG:4326")
  //     ); //将多边形要素坐标系投影为EPSG:4326
  //     const coordinates = geom.getLinearRing(0).getCoordinates(); //解析多边形的坐标值
  //     const area = Math.abs(wgs84Sphere.geodesicArea(coordinates)); //获取面积

  //     let output;
  //     if (area > 10000) {
  //       output =
  //         Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>"; //换算成KM单位
  //     } else {
  //       output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>"; //m为单位
  //     }
  //     return output; //返回多边形的面积
  //   };

  //   //addInteraction(); //调用加载绘制交互控件方法，添加绘图进行测量
  //   /**
  //    *  当用户正在绘制多边形时的提示信息文本
  //    * @type {string}
  //    */
  //   const continuePolygonMsg = "单击继续绘制多边形";
  //   /**
  //    * 当用户正在绘制线时的提示信息文本
  //    * @type {string}
  //    */
  //   const continueLineMsg = "单击继续绘制线,双击结束";

  //   //map.on('pointermove', pointerMoveHandler); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
  //   //地图绑定鼠标移出事件，鼠标移出时为帮助提示框设置隐藏样式
  //   $(map.getViewport()).on("mouseout", function () {
  //     $(helpTooltipElement).addClass("hidden");
  //   });
  // })();
};

//移除layer（图层）；参数就是getMapLayer方法的返回值
function removeLayer(layer) {
  map.removeLayer(layer);
}
//画面
function drawPolygon(id, strokeColor, fillColor, polygonData) {
  const polygon = new Polygon([polygonData]); //示例: [[100,40],[100,50],[100,60]]
  polygon.applyTransform(olProj.getTransform("EPSG:4326", "EPSG:3857"));
  const featurepy = new Feature(polygon);
  featurepy.setStyle(
    new Style({
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: 3,
      }),
    })
  );
  featurepy.setId(id);
  const vectorSource = new olSource.Vector();
  vectorSource.addFeature(featurepy);
  const vectorLayer = new VectorLayer({
    //数据源
    source: vectorSource,
    name: id,
  });
  map.addLayer(vectorLayer);
}

//根据ID获取layer(图层);id是创建时设置的
function getMapLayer(id) {
  const layers = map.getLayers();
  for (let i = 0; i < layers.getLength(); i++) {
    const name = layers.item(i).get("name");
    if (name == id) {
      return layers.item(i);
    }
  }
  return null;
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

//画防区(更新防区 布防,撤防)
export function drawAreaPolygon(
  id,
  working,
  delay,
  bypass,
  isfailure,
  geoData
) {
  const arealayer = getMapLayer("area" + id);
  if (arealayer != null) {
    removeLayer(arealayer);
  }
  const fillColor = getDrawPolygonFillColor(working, delay, bypass, isfailure);
  const strokeColor = getDrawPolygonStrokeColor(
    working,
    delay,
    bypass,
    isfailure
  );
  drawPolygon("area" + id, strokeColor, fillColor, geoData);
}

//画点,地图上的雷达，摄像机等符号
export function drawPoint(id, imgUrl, text, textColor, geoData) {
  const poiSource = new VectorSource({});
  const poiVector = new VectorLayer({
    source: poiSource,
    name: id,
  });
  map.addLayer(poiVector);
  const geometry = new Point(transform(geoData, "EPSG:4326", "EPSG:3857")); //示例：[100,40]
  const ptFeature = new Feature({
    geometry: geometry,
  });
  ptFeature.setId(id);
  ptFeature.setStyle(
    new Style({
      image: new Icon({
        src: imgUrl, //示例：'./image/car_yuan.png';
        scale: 0.5,
      }),
      text: new Text({
        text: text,
        font: 30 + "px",
        fill: new Fill({ color: textColor }),
        //stroke: new Stroke({color: 'black', width: 3}),
        textBaseline: "bottom",
        offsetY: 30,
        scale: 1,
      }),
    })
  );
  poiVector.getSource().addFeature(ptFeature);
}

// 获取所有元素的显示隐藏状态
export const getAllVisibleState = () => {
  const visibleStateArr = [];
  map.getLayers().forEach((item) => {
    visibleStateArr.push({
      name: item.get("name"),
      visible: item.getVisible(),
    });
  });

  return visibleStateArr;
};

// 显示/隐藏 id layer的ID，visible 显示/隐藏:控制图层；要素点和防区是一个占一个图层；轨迹点和轨迹线是所有放到一个图层;结合资源列表使用
export function setElementVisible(id, visible) {
  const layers = map.getLayers();

  for (let i = 0; i < layers.getLength(); i++) {
    const name = layers.item(i).get("name");

    if (name == id) {
      layers.item(i).setVisible(visible);
      const dd = layers.item(i).getVisible();
    }
  }
}
//移除之前的线
function removeLineSourceFeature(id) {
  trgtLineLayer
    .getSource()
    .getFeatures()
    .forEach((feature) => {
      if (id == feature.getId()) {
        trgtLineLayer.getSource().removeFeature(feature);
      }
    });
}

//移除之前的点
function removePtSourceFeature(id) {
  trgtptLayer
    .getSource()
    .getFeatures()
    .forEach((feature) => {
      if (id == feature.getId()) {
        trgtptLayer.getSource().removeFeature(feature);
      }
    });
}

//画目标轨迹。id是feature要素的唯一标识，text包括告警id，速度，方向；geoData是告警的点坐标
// 储存目标点
const trgtlineArray = [];
export function setTrgtData(id, text, geoData) {
  // 要画轨迹线用到的点
  let arraylineData = [];

  // 查找要画的轨迹线之前没有画过；如果有，继续在之前的轨迹线后面画点
  const newNum1 = trgtlineArray.find((item, index) => {
    return item.id == id;
  });

  if (newNum1 != undefined) {
    arraylineData = newNum1.line;
    // transform方法；坐标数据，源数据使用的投影坐标系，目标投影坐标系；将坐标数据转换为目标坐标系下的坐标
    arraylineData.push(transform(geoData, "EPSG:4326", "EPSG:3857"));
  } else {
    const arrayData = {};
    arrayData.id = id;
    arrayData.line = arraylineData;
    arraylineData.push(transform(geoData, "EPSG:4326", "EPSG:3857"));
    trgtlineArray.push(arrayData);
  }

  // 移除之前的线。之前的点已经储存在数组中，清除之前的线重新画
  removeLineSourceFeature("trgtline" + id);

  const trgtlineFeature = new Feature({
    geometry: new LineString(arraylineData),
  });
  trgtlineFeature.setId("trgtline" + id);
  trgtLineLayer.getSource().addFeature(trgtlineFeature);

  //移除之前的点
  removePtSourceFeature("trgt" + id);
  const trgtFeature = new Feature({
    geometry: new Point(transform(geoData, "EPSG:4326", "EPSG:3857")),
  });
  trgtFeature.setId("trgt" + id);
  trgtptLayer.getSource().addFeature(trgtFeature);

  trgtFeature.setStyle(
    new Style({
      image: new Icon({
        src: trgtImgsrc,
        scale: 0.1,
      }),
      text: new Text({
        text: text,
        fill: new Fill({ color: "#efff55" }),
        //stroke: new Stroke({color: 'black', width: 3}),
        textBaseline: "bottom",
        offsetY: 25,
        scale: 1,
      }),
    })
  );
}

//画线
function drawLine(id, geometryLine, color) {
  const lineSources = new olSource.Vector();
  lineSources.addFeature(
    new Feature({
      name: id,
      geometry: geometryLine, //示例：new ol.geom.LineString([ol.proj.transform([100,40], 'EPSG:4326', 'EPSG:3857'),ol.proj.transform([110,40], 'EPSG:4326', 'EPSG:3857')])
    })
  );
  const lineLayer = new VectorLayer({
    name: id,
    source: lineSources,
    style: [
      new Style({
        stroke: new Stroke({
          color: color, //示例 '#0014ff'
          width: 2,
        }),
      }),
    ],
  });
  map.addLayer(lineLayer);
}

//获取要素的显隐状态
function getElementVisible(id) {
  const layers = map.getLayers();
  for (let i = 0; i < layers.getLength(); i++) {
    const name = layers.item(i).get("name");
    if (name == id) {
      return layers.item(i).getVisible();
    }
  }
  return false;
}

//告警动画
let radius = 10; // 圆环大小
function animation(event) {
  for (let i = 0; i < 3; i++) {
    if (radius >= 20) {
      radius = 0;
    }
    const pointStyle = new Style({
      image: new CircleStyle({
        radius: radius,
        stroke: new Stroke({
          color: "rgb(255,0,0)",
          width: 4 - radius / 10,
        }),
      }),
    });
    const vectorContext = event.vectorContext;
    vectorContext.setStyle(pointStyle);
    // vectorContext.drawGeometry(new ol.geom.Point(ol.proj.transform([101,41], 'EPSG:4326', 'EPSG:3857')));
    trgtptLayer
      .getSource()
      .getFeatures()
      .forEach((element) => {
        const geom = element.getGeometry();
        vectorContext.drawGeometry(geom);
      });
    radius = radius + 0.1;
    //触发map的postcompose事件
    map.render();
  }
}
