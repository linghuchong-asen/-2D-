const axios_url = "http://192.168.0.100:8099/API/V0.1/";

// 获取防区
function drawAlarmArea() {
  getAxios("Area/AlarmArea/", "get", {}, getAlarmArea, errFunc);
  function getAlarmArea(obj) {
    for (var i = 0; i < obj.data.length; i++) {
      var alarmArea = obj.data[i];
      var geoData = alarmArea.shape.coordinates[0];
      drawAreaPolygon(
        alarmArea.id,
        alarmArea.is_working,
        alarmArea.delay,
        alarmArea.is_bypass,
        alarmArea.is_failure,
        geoData
      );
    }
  }
}

// 资源列表
function elementProject() {
  var data = {};
  data.level = 2;
  getAxios(
    "JMSceneConfigService/ElementProject/",
    "get",
    data,
    getSceneConfigElement,
    errFunc
  );
  var ele, eleText, iconUrl, eleColor, eleGeo;
  function getSceneConfigElement(obj) {
    for (var i = 0; i < obj.data.length; i++) {
      ele = obj.data[i];
      console.log(ele);
      eleText = ele.name;
      if (ele.elementtype == "point") {
        var eleStyle = JSON.parse(ele.style);
        var ptGeo = eleStyle.cGeometry;
        var iconSymbol = eleStyle.iconSymbol;
        var textSymbol = eleStyle.textSymbol;
        eleGeo = [ptGeo.X, ptGeo.Y];
        iconUrl = iconSymbol.Url;
        // eleColor =rgbaToHexColor([textSymbol.Fill.X*255,textSymbol.Fill.Y*255,textSymbol.Fill.Z*255,textSymbol.Fill.W*255]);
        eleColor = "#ffffff";
        drawPoint("element" + ele.id, iconUrl, eleText, eleColor, eleGeo);
      }
    }
  }
}
