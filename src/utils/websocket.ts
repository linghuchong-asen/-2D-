/*
 * @Description:websocket封装
 * @Author: yangsen
 * @Date: 2022-10-09 13:56:17
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-09 18:01:37
 */

export class SocketServer {
  // NOTE: class定义实例属性ts类型，直接在内部定义就可以
  ws: WebSocket | null;
  connected: boolean;
  connectRetryCount: number;
  url: string;

  constructor() {
    // 和服务端连接的socket对象
    this.ws = null;

    // 标识是否连接成功
    this.connected = false;

    // 重新连接尝试的次数
    this.connectRetryCount = 0;

    // 后台地址
    this.url = "ws://192.168.0.100:5000";
  }
  // 获取token
  private token = localStorage.getItem("Authorization");
  // 连接方法
  connect(param?: object, url?: string) {
    // 拼接url
    if (url) this.url += url;
    // 连接服务器
    if (!window.WebSocket) {
      return console.error("您的浏览器不支持websocket");
    }
    if (this.token) {
      this.ws = new WebSocket(this.url, [this.token]);
      // 连接成功事件
      this.ws.onopen = () => {
        this.connected = true;
        // 重置重新连接尝试的次数
        this.connectRetryCount = 0;
      };

      // 断开连接
      this.ws.onclose = (e) => {
        console.log(
          "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
        );
        this.connected = false;
        // 断开重连
        this.connectRetryCount++;
        setTimeout(() => {
          this.connect();
        }, 1000);
      };

      // 接收到数据
      this.ws.onmessage = (e) => {
        // websocket直接推过来的是string类型
        const data = JSON.parse(e.data);
        // 拿到推送的数据
        if (param) {
          Object.assign(param, data);
        }
      };

      // 连接出错
      this.ws.onerror = (e) => {
        console.error(e);
      };
    } else {
      console.log("未获取到token");
    }
  }
}
