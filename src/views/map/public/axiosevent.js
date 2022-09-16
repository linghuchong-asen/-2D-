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

axios.interceptors.request.use(
  (config) => {
    const token = window.sessionStorage.getItem("token");
    const headers = config.headers;
    if (token) {
      if (headers) headers.Authorization = "Bearer " + token;
    }
    // 必须return出去，否则配置不成功
    return config;
  },
  (erro) => {
    // 错误情况的处理
    console.log(erro);
  }
);

function getAxios(url, type, data, succFunc, errFunc) {
  if (type == "get") {
    axios
      .get(axios_url + url, {
        params: data,
      })
      .then(function (response) {
        succFunc(response);
      })
      .catch(function (error) {
        errFunc(error);
      });
  } else if (type == "post") {
    axios
      .post(axios_url + url, data)
      .then(function (response) {
        succFunc(response);
      })
      .catch(function (error) {
        errFunc(error);
      });
  }
}
function errFunc(err) {
  console.log(err);
  if (err.status === 500) {
    layer.msg("服务器异常，未得到数据");
  } else if (err.status === 403) {
    layer.msg("未授权");
  } else if (err.status === 401) {
  } else if (err.status === 404) {
    layer.msg("未找到您要访问到数据");
  } else {
    console.log(err);
  }
}
