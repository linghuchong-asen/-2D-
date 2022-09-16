/*
 * @Description:openlayers的操作方法（地图相关）
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-16 19:28:31
 * @LastEditors: yangsen
 * @LastEditTime: 2022-09-16 21:08:03
 */
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const initMap = () => {
  //初始化map
  const map = new Map({
    // controls: control.defaults({
    //   attribution: false,
    //   zoom: false,
    //   rotate: false,
    // }),
    target: "map",
    view: new View({
      center: [0, 0],
      zoom: 10,
    }),
  });
  // 在线高德地图
  const mlayer = new TileLayer({
    projection: "EPSG:4326",
    source: new XYZ({
      url: "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    }),
    name: "在线高德影像地图",
  });

  // //加载图层
  map.addLayer(mlayer);
};

// //离线图层:引用本地图片
// const offlineMapLayer = new ol.layer.Tile({
//   projection: "EPSG:4326",
//   // source: new ol.source.XYZ({ url: "./tiles2/{z}/{x}/{y}.png" }),
// });
// // 离线地图
// const offlineMap = new ol.layer.Tile({
//   name: "离线高德影像地图",
//   source: offlineMapLayer,
// });

// // 引用服务上的地图
// const onlineSource = new ol.source.XYZ({
//   tileUrlFunction: function (coordinate) {
//     const z = coordinate[0] - 1;
//     const x = coordinate[1];
//     const y = -coordinate[2] - 1;
//     return "http://192.168.0.100:8889/boao&x=" + x + "&y=" + y + "&z=" + z;
//   },
//   maxZoom: 18,
//   minZoom: 2,
//   projection: "EPSG:4326",
// });

// map.addLayer(offlineMap);

// //鼠标点的经纬度
// const mousePositionControl = new ol.control.MousePosition({
//   //样式类名称
//   className: "mosuePosition",
//   //投影坐标格式，显示小数点后边多少位
//   coordinateFormat: ol.coordinate.createStringXY(8),
//   //指定投影
//   projection: "EPSG:4326",
//   //目标容器
//   target: document.getElementById("myposition"),
// });
// map.addControl(mousePositionControl);

// //比例尺
// const scaleLineControl = new ol.control.ScaleLine({
//   //设置度量单位为米
//   units: "metric",
//   target: "scalebar",
//   className: "ol-scale-line",
// });
// map.addControl(scaleLineControl);

// //旋转控件
// const ratate = new ol.control.Rotate({
//   autoHide: false,
// });
// //map.addControl(ratate);

// //设置中心点:窗口中心定位到目标点
// function setMapCenterPoint(point) {
//   map.getView().setCenter(ol.proj.transform(point, "EPSG:4326", "EPSG:3857"));
// }

// //设置层级：瓦片地图的层级
// function setMapZoom(zoom) {
//   map.getView().setZoom(zoom);
// }

// //画点
// function drawPoint(id, imgUrl, text, textColor, geoData) {
//   const poiSource = new ol.source.Vector({});
//   const poiVector = new ol.layer.Vector({
//     source: poiSource,
//     name: id,
//   });
//   map.addLayer(poiVector);
//   const geometry = new ol.geom.Point(
//     ol.proj.transform(geoData, "EPSG:4326", "EPSG:3857")
//   ); //示例：[100,40]
//   const ptFeature = new ol.Feature({
//     geometry: geometry,
//   });
//   ptFeature.setId(id);
//   ptFeature.setStyle(
//     new ol.style.Style({
//       image: new ol.style.Icon({
//         src: imgUrl, //示例：'./image/car_yuan.png';
//         scale: 0.5,
//       }),
//       text: new ol.style.Text({
//         text: text,
//         font: 30 + "px",
//         fill: new ol.style.Fill({ color: textColor }),
//         //stroke: new ol.style.Stroke({color: 'black', width: 3}),
//         textBaseline: "bottom",
//         offsetY: 30,
//         scale: 1,
//       }),
//     })
//   );
//   poiVector.getSource().addFeature(ptFeature);
// }

// //画线
// function drawLine(id, geometryLine, color) {
//   const lineSources = new ol.source.Vector();
//   lineSources.addFeature(
//     new ol.Feature({
//       name: id,
//       geometry: geometryLine, //示例：new ol.geom.LineString([ol.proj.transform([100,40], 'EPSG:4326', 'EPSG:3857'),ol.proj.transform([110,40], 'EPSG:4326', 'EPSG:3857')])
//     })
//   );
//   const lineLayer = new ol.layer.Vector({
//     name: id,
//     source: lineSources,
//     style: [
//       new ol.style.Style({
//         stroke: new ol.style.Stroke({
//           color: color, //示例 '#0014ff'
//           width: 2,
//         }),
//       }),
//     ],
//   });
//   map.addLayer(lineLayer);
// }

// //画防区(更新防区 布防,撤防)
// function drawAreaPolygon(id, working, delay, bypass, isfailure, geoData) {
//   const arealayer = getMapLayer("area" + id);
//   if (arealayer != null) {
//     removeLayer(arealayer);
//   }
//   const fillColor = getDrawPolygonFillColor(working, delay, bypass, isfailure);
//   const strokeColor = getDrawPolygonStrokeColor(
//     working,
//     delay,
//     bypass,
//     isfailure
//   );
//   drawPolygon("area" + id, strokeColor, fillColor, geoData);
// }
// //画面
// function drawPolygon(id, strokeColor, fillColor, polygonData) {
//   const polygon = new ol.geom.Polygon([polygonData]); //示例: [[100,40],[100,50],[100,60]]
//   polygon.applyTransform(ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
//   const featurepy = new ol.Feature(polygon);
//   featurepy.setStyle(
//     new ol.style.Style({
//       fill: new ol.style.Fill({
//         color: fillColor,
//       }),
//       stroke: new ol.style.Stroke({
//         color: strokeColor,
//         width: 3,
//       }),
//     })
//   );
//   featurepy.setId(id);
//   const vectorSource = new ol.source.Vector();
//   vectorSource.addFeature(featurepy);
//   const vectorLayer = new ol.layer.Vector({
//     //数据源
//     source: vectorSource,
//     name: id,
//   });
//   map.addLayer(vectorLayer);
// }

// //openlayer的图层
// const trgtLineSource = new ol.source.Vector(); //
// const trgtLineLayer = new ol.layer.Vector({
//   // 所有轨迹线放到一个组中
//   source: trgtLineSource,
//   style: [
//     new ol.style.Style({
//       stroke: new ol.style.Stroke({
//         color: "#ff0000",
//         width: 2,
//       }),
//     }),
//   ],
// });
// map.addLayer(trgtLineLayer);
// const trgtlineArray = [];

// const trgtptSources = new ol.source.Vector(); //所有目标放到一个组中
// const trgtptLayer = new ol.layer.Vector({
//   source: trgtptSources,
// });
// map.addLayer(trgtptLayer);
// const trgtImgsrc = "./image/alarm_yuan.png";

// //画目标轨迹
// function setTrgtData(id, text, geoData) {
//   //轨迹
//   let arraylineData = [];
//   const newNum1 = trgtlineArray.find((item, index) => {
//     return item.id == id;
//   });

//   if (newNum1 != undefined) {
//     arraylineData = newNum1.line;
//     arraylineData.push(ol.proj.transform(geoData, "EPSG:4326", "EPSG:3857"));
//   } else {
//     const arrayData = {};
//     arrayData.id = id;
//     arrayData.line = arraylineData;
//     arraylineData.push(ol.proj.transform(geoData, "EPSG:4326", "EPSG:3857"));
//     trgtlineArray.push(arrayData);
//   }
//   removeLineSourceFeature("trgtline" + id);
//   const trgtlineFeature = new ol.Feature({
//     geometry: new ol.geom.LineString(arraylineData),
//   });
//   trgtlineFeature.setId("trgtline" + id);
//   trgtLineLayer.getSource().addFeature(trgtlineFeature);

//   //目标点
//   removePtSourceFeature("trgt" + id);
//   const trgtFeature = new ol.Feature({
//     geometry: new ol.geom.Point(
//       ol.proj.transform(geoData, "EPSG:4326", "EPSG:3857")
//     ),
//   });
//   trgtFeature.setId("trgt" + id);
//   trgtptLayer.getSource().addFeature(trgtFeature);
//   trgtFeature.setStyle(
//     new ol.style.Style({
//       image: new ol.style.Icon({
//         src: trgtImgsrc,
//         scale: 0.1,
//       }),
//       text: new ol.style.Text({
//         text: text,
//         fill: new ol.style.Fill({ color: "#efff55" }),
//         //stroke: new ol.style.Stroke({color: 'black', width: 3}),
//         textBaseline: "bottom",
//         offsetY: 25,
//         scale: 1,
//       }),
//     })
//   );
// }

// //移除之前的点
// function removePtSourceFeature(id) {
//   trgtptLayer
//     .getSource()
//     .getFeatures()
//     .forEach((feature) => {
//       if (id == feature.getId()) {
//         trgtptLayer.getSource().removeFeature(feature);
//       }
//     });
// }

// //移除之前的线
// function removeLineSourceFeature(id) {
//   trgtLineLayer
//     .getSource()
//     .getFeatures()
//     .forEach((feature) => {
//       if (id == feature.getId()) {
//         trgtLineLayer.getSource().removeFeature(feature);
//       }
//     });
// }

// ///显示/隐藏 id layer的ID，visible 显示/隐藏:控制图层；要素点和防区是一个占一个图层；轨迹点和轨迹线是所有放到一个图层;结合资源列表使用
// function setElementVisible(id, visible) {
//   const layers = map.getLayers();
//   for (let i = 0; i < layers.getLength(); i++) {
//     const name = layers.item(i).get("name");
//     if (name == id) {
//       layers.item(i).setVisible(visible);
//       const dd = layers.item(i).getVisible();
//     }
//   }
// }

// //获取要素的显隐状态
// function getElementVisible(id) {
//   const layers = map.getLayers();
//   for (let i = 0; i < layers.getLength(); i++) {
//     const name = layers.item(i).get("name");
//     if (name == id) {
//       return layers.item(i).getVisible();
//     }
//   }
//   return false;
// }

// //根据ID获取layer(图层);id是创建时设置的
// function getMapLayer(id) {
//   const layers = map.getLayers();
//   for (let i = 0; i < layers.getLength(); i++) {
//     const name = layers.item(i).get("name");
//     if (name == id) {
//       return layers.item(i);
//     }
//   }
//   return null;
// }

// //移除layer（图层）；参数就是getMapLayer方法的返回值
// function removeLayer(layer) {
//   map.removeLayer(layer);
// }

// let tip_message_flag = true; // 有无弹窗的标识
// //弹窗；实况视频哪些属性信息；openLayers地图中的弹窗
// const overlay = new ol.Overlay({
//   element: document.getElementById("popup"), //设置弹出框的容器
//   autoPan: true, //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
//   autoPanAnimation: {
//     duration: 250,
//   },
// });
// map.addOverlay(overlay);
// // 地图的点击事件
// map.on("click", function (e) {
//   if (tip_message_flag) {
//     // 点击地图中的位置相对的窗口
//     const pixel = map.getEventPixel(e.originalEvent);
//     map.forEachFeatureAtPixel(pixel, function (feature) {
//       // 获取id
//       const getid = feature.getId();
//       //console.log(getid);
//       if (getid == null) {
//         return;
//       } else if (getid.indexOf("element") > -1) {
//         $("#popup-content").html(`
//                 <p><span class="p_realtime">实况视频</span></p>
//                 <p><span class="p_history">历史回放</span></p>
//                 <p><span class="p_proprety">属性信息</span></p>
//                 `);
//         // 点击的地图的位置
//         const coodinate = e.coordinate;
//         // 弹窗的位置
//         overlay.setPosition(coodinate);
//         tip_message_flag = false;
//       } else {
//         $("#popup-content").html(``);
//       }
//     });
//   }
// });

// document.addEventListener("click", function () {
//   if (tip_message_flag) {
//     // 通过给位置一个undefined来让弹窗不显示在窗口
//     overlay.setPosition(undefined);
//     return false;
//   }
//   tip_message_flag = true;
// });

// //告警动画
// let radius = 10; // 圆环大小
// function animation(event) {
//   for (let i = 0; i < 3; i++) {
//     if (radius >= 20) {
//       radius = 0;
//     }
//     const pointStyle = new ol.style.Style({
//       image: new ol.style.Circle({
//         radius: radius,
//         stroke: new ol.style.Stroke({
//           color: "rgb(255,0,0)",
//           width: 4 - radius / 10,
//         }),
//       }),
//     });
//     const vectorContext = event.vectorContext;
//     vectorContext.setStyle(pointStyle);
//     // vectorContext.drawGeometry(new ol.geom.Point(ol.proj.transform([101,41], 'EPSG:4326', 'EPSG:3857')));
//     trgtptLayer
//       .getSource()
//       .getFeatures()
//       .forEach((element) => {
//         const geom = element.getGeometry();
//         vectorContext.drawGeometry(geom);
//       });
//     radius = radius + 0.1;
//     //触发map的postcompose事件
//     map.render();
//   }
// }

// //测距 ranging

// function ranging() {
//   map.removeInteraction(draw_ranging); //移除绘制图形
//   const key = map.on("pointermove", pointerMoveHandler);
//   ol.Observable.unByKey(key);
//   map.on("pointermove", pointerMoveHandler);
//   addInteraction_ranging("line");
// }

// function rangingArea() {
//   map.removeInteraction(draw_ranging); //移除绘制图形
//   const key = map.on("pointermove", pointerMoveHandler);
//   ol.Observable.unByKey(key);
//   map.on("pointermove", pointerMoveHandler);
//   addInteraction_ranging("area");
// }

// let draw_ranging;
// (function () {
//   const source_ranging = new ol.source.Vector(); //图层数据源
//   const vector_ranging = new ol.layer.Vector({
//     source: source_ranging,
//     style: new ol.style.Style({
//       fill: new ol.style.Fill({
//         color: "rgba(255,15,200,0.2)",
//       }),
//       stroke: new ol.style.Stroke({
//         color: "#f2412e",
//         width: 3,
//       }),
//       image: new ol.style.Circle({
//         radius: 7,
//         fill: new ol.style.Fill({
//           color: "#ff09f1",
//         }),
//       }),
//     }),
//   });
//   map.addLayer(vector_ranging);

//   $(".ranging").click(function () {
//     map.removeInteraction(draw_ranging); //移除绘制图形
//     const key = map.on("pointermove", pointerMoveHandler);
//     ol.Observable.unByKey(key);
//     map.on("pointermove", pointerMoveHandler);
//     addInteraction_ranging("line");
//   });

//   document.getElementsByClassName(".ranging_area")[0].click(function () {
//     map.removeInteraction(draw_ranging); //移除绘制图形
//     const key = map.on("pointermove", pointerMoveHandler);
//     ol.Observable.unByKey(key);
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
//       if (geom instanceof ol.geom.Polygon) {
//         helpMsg = continuePolygonMsg; //绘制多边形时提示相应内容
//       } else if (geom instanceof ol.geom.LineString) {
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
//     draw_ranging = new ol.interaction.Draw({
//       source: source_ranging, //测量绘制层数据源
//       type: /** @type {ol.geom.GeometryType} */ (type), //几何图形类型
//       style: new ol.style.Style({
//         //绘制几何图形的样式
//         fill: new ol.style.Fill({
//           color: "rgba(255, 255, 255, 0.2)",
//         }),
//         stroke: new ol.style.Stroke({
//           color: "rgba(255, 0, 0, 0.5)",
//           lineDash: [10, 10],
//           width: 2,
//         }),
//         image: new ol.style.Circle({
//           radius: 5,
//           stroke: new ol.style.Stroke({
//             color: "rgba(0, 0, 0, 0.7)",
//           }),
//           fill: new ol.style.Fill({
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
//           } else if (geom instanceof ol.geom.LineString) {
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
//         ol.Observable.unByKey(listener);
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
//     helpTooltip = new ol.Overlay({
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
//     const measureTooltip = new ol.Overlay({
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
//       const c1 = ol.proj.transform(coordinates[i], sourceProj, "EPSG:4326");
//       const c2 = ol.proj.transform(coordinates[i + 1], sourceProj, "EPSG:4326");
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
