import { http } from "@/utils/http";
import * as Hls from "hls.js";
import { getSvgUrl } from "@/utils/index";
const closeSvg = getSvgUrl("close");
const loaderSvg = getSvgUrl("loader");

export const Server = {
  ip: "http://192.168.0.100:8099",
  get_webrtc: function (id, data) {
    return http("/API/V0.1/Onvif/GetWebrtc/" + id + "/", {
      method: "post",
      params: data,
    });
  },
  get_history: function (id, data) {
    return http("/API/V0.1/Onvif/GetHistoryPlay/" + id + "/", {
      method: "post",
      params: data,
    });
  },
  del_history: function (id) {
    return http("/API/V0.1/Onvif/DelHistoryPlay/" + id + "/");
  },
};

export function initServer(ip) {
  Server.ip = ip;
}

// 视频墙类
export class PlayerWallProcessor {
  constructor(flag) {
    // flag 标识 0 创建全屏 1 创建半屏
    this.flag = flag;
    this.container = document.getElementsByClassName("wall-container")[0];
    this.openPlayers = {};
  }

  initPlayer() {
    const _this = this;
    const grid = "grid-6";
    const count = 6;
    if (_this.flag == 0) {
      const grid = "grid-9";
      const count = 9;
      if (this.container.className.indexOf("half-wall-container") > -1)
        this.container.className = this.container.className.replace(
          " half-wall-container",
          ""
        );
    } else if (_this.flag == 1) {
      if (this.container.className.indexOf("half-wall-container") === -1)
        this.container.className += " half-wall-container";
    }
    const player =
      '<div class="' +
      grid +
      ' player empty">' +
      '<video class="video-class empty"  autoplay muted playsinline   ' +
      'style="width: 100%; height: 100%;"></video>' +
      '<a class="close-stream-btn"><img class="close" src="' +
      closeSvg +
      '"></a>' +
      '<img class="loader d-none" src="' +
      loaderSvg +
      '" /></div>';
    let players = "";
    for (let i = 0; i < count; i++) {
      players += player;
    }
    _this.containerWrapper.innerHTML = players;
  }

  createWall() {
    const _this = this;
    _this.initPlayer();
    _this.player = document.getElementsByClassName("player");

    const click = (index) => {
      return () => {
        if (_this.selectindex != index) {
          if (
            _this.selectindex != undefined &&
            _this.player[_this.selectindex] != undefined
          ) {
            _this.player[_this.selectindex].className = _this.player[
              _this.selectindex
            ].className.replace(" select", "");
          }
          _this.player[index].className += " select";
        }
        _this.selectindex = index;
      };
    };

    const dblclick = (index) => {
      return () => {
        if (
          _this.player[index].className.indexOf("full-screen-") == -1 &&
          _this.player[index].className.indexOf("empty") == -1
        ) {
          _this.player[index].className += " full-screen-" + _this.flag;
          _this.containerWrapper.className += " full";
          for (let i = 0; i < _this.player.length; i++) {
            if (i != index) {
              _this.player[i].className += " d-none";
            }
          }
        } else if (_this.player[index].className.indexOf("full-screen-") > -1) {
          _this.player[index].className = _this.player[index].className.replace(
            " full-screen-" + _this.flag,
            ""
          );
          _this.containerWrapper.className =
            _this.containerWrapper.className.replace(" full", "");
          for (let i = 0; i < _this.player.length; i++) {
            if (i != index) {
              _this.player[i].className = _this.player[i].className.replace(
                " d-none",
                ""
              );
            }
          }
        }
      };
    };
    const close = (index) => {
      return () => {
        if (_this.player[index].className.indexOf("full-screen-") > -1) {
          _this.player[index].className = _this.player[index].className.replace(
            " full-screen-" + _this.flag,
            ""
          );
          _this.containerWrapper.className =
            _this.containerWrapper.className.replace(" full", "");
          for (let i = 0; i < _this.player.length; i++) {
            if (i != index) {
              _this.player[i].className = _this.player[i].className.replace(
                " d-none",
                ""
              );
            }
          }
          return;
        }
        _this.closePlay(index);
      };
    };

    const playing = (index) => {
      return (e) => {
        if (_this.openPlayers[index].loader) {
          _this.openPlayers[index].loader.className += " d-none";
        }
      };
    };

    for (let i = 0; i < _this.player.length; i++) {
      _this.player[i].onclick = click(i);
      _this.player[i].ondblclick = dblclick(i);
      _this.player[i].getElementsByClassName("close-stream-btn")[0].onclick =
        close(i);
      _this.player[i]
        .getElementsByClassName("video-class")[0]
        .addEventListener("playing", playing(i));
      const hisplay = localStorage.getItem("player_" + i);
      if (!hisplay) {
        localStorage.setItem("player_" + i, 0);
      } else {
        if (hisplay != 0) {
          try {
            this.play(i, hisplay);
          } catch (error) {
            console.log(error);
          }
        }
      }

      const hisplayhis = localStorage.getItem("hisplayer_" + i);
      if (!hisplayhis) {
        localStorage.setItem("hisplayer_" + i, 0);
      } else {
        if (hisplayhis != 0) {
          try {
            localStorage.setItem("hisplayer_" + i, 0);
            Server.del_history(hisplayhis);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }

  // 播放历史视频
  playHisSelect(stream_id, start_time, end_time) {
    debugger;
    const _this = this;
    const index = _this.selectindex;
    // 指定窗体播放历史视频
    _this.player[index].className = _this.player[index].className.replace(
      " empty",
      ""
    );
    _this.openPlayers[index] = new WebRTCPlayer(
      _this.player[index].getElementsByTagName("video")[0]
    );
    _this.openPlayers[index].video.setAttribute("controls", true);
    _this.openPlayers[index].stream_id = stream_id;
    _this.openPlayers[index].playHistory(start_time, end_time);
    _this.openPlayers[index].onClosePlay = (function (i) {
      return () => {
        _this.closePlay(i);
      };
    })(index);
    localStorage.setItem(
      "hisplayer_" + index,
      _this.openPlayers[index].hisstream_id
    );
  }

  // 在选中窗体播放视频
  playSelect(stream_id) {
    this.play(this.selectindex, stream_id);
  }

  // 播放视频方法；参数1：视频墙窗格的index；参数2：视频源的摄像机的id
  play(index, stream_id) {
    const _this = this;
    // 指定窗体播放视频
    _this.player[index].className = _this.player[index].className.replace(
      " empty",
      ""
    );
    _this.openPlayers[index] = new WebRTCPlayer(
      _this.player[index].getElementsByTagName("video")[0]
    );
    _this.openPlayers[index].stream_id = stream_id;
    _this.openPlayers[index].loader =
      _this.player[index].getElementsByClassName("loader")[0];
    _this.openPlayers[index].playWebrtc();
    _this.openPlayers[index].onClosePlay = (function (i) {
      return () => {
        _this.closePlay(i);
      };
    })(index);
    localStorage.setItem("player_" + index, stream_id);
  }

  // 关闭视频
  closePlay(i) {
    // 关闭视频窗
    localStorage.setItem("player_" + i, 0);
    this.destroy(i);
  }
  destroy(i) {
    // 销毁视频
    if (
      this.player[i].getElementsByTagName("video")[0].hasAttribute("controls")
    ) {
      this.player[i]
        .getElementsByTagName("video")[0]
        .removeAttribute("controls");
    }
    this.player[i].className += " empty";
    this.openPlayers[i].destroy();
    delete this.openPlayers[i];
  }

  initWall() {
    // 初始化视频墙
    const _this = this;
    _this.container.innerHTML =
      '<div class="container-fluid"><div class="content-wrapper"><div class="grid-wrapper"></div></div></div>';
    _this.containerWrapper = document.getElementsByClassName("grid-wrapper")[0];
    _this.createWall();
  }

  cutFlag() {
    // 切换视频墙
    for (const item in this.openPlayers) {
      this.destroy(item);
    }
    this.flag = this.flag == 0 ? 1 : 0;
    this.initWall();
  }
}

// webRTC类
export class WebRTCPlayer {
  constructor(video) {
    this.webrtc = null;
    this.webrtcSendChannel = null;
    this.webrtcSendChannelInterval = null;
    this.stream_id = 0;
    this.hisstream_id = 0;
    this.video = video;
    this.loader = null;
    this.index = -1;
    this.onClosePlay = null;
    this.ishistory = false;
    this.hls = null;
  }

  playHistory(start_time, end_time) {
    const _this = this;
    _this.ishistory = true;
    const data = {
      starttime: start_time,
      endtime: end_time,
    };
    Server.get_history(_this.stream_id, data)
      .then((response) => response.data)
      .then((data) => {
        try {
          this.hisstream_id = data.stream_id;
          if (Hls.isSupported()) {
            debugger;
            _this.hls = new Hls({
              manifestLoadingTimeOut: 60000,
            });
            _this.hls.loadSource(data.url);
            debugger;
            _this.hls.attachMedia(_this.video);
            debugger;
          } else if (_this.video.canPlayType("application/vnd.apple.mpegurl")) {
            _this.video.src = data.url;
            _this.video.load();
          }
        } catch (e) {
          console.log(e);
          debugger;
          alert("视频加载失败");
          _this.onClosePlay();
          _this.destroy();
        }
      })
      .catch(function (error) {
        alert("未找到视频源");
        if (_this.onClosePlay) {
          _this.onClosePlay();
        }
      });
  }

  playWebrtc() {
    const _this = this;
    _this.loader.className = _this.loader.className.replace(" d-none", "");
    // 创建一个连接
    this.webrtc = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
      ],
      sdpSemantics: "unified-plan",
    });
    // 连接时初始化信令
    this.webrtc.onnegotiationneeded = this.handleNegotiationNeeded.bind(this);
    // 设置追踪事件
    this.webrtc.ontrack = function (event) {
      // 开始播放
      _this.video.srcObject = event.streams[0];
      _this.video.play();
    };
    this.webrtc.addTransceiver("video", {
      direction: "sendrecv",
    });

    // 创建一个数据通道
    this.webrtcSendChannel = this.webrtc.createDataChannel("foo");
    // 关闭通道事件
    this.webrtcSendChannel.onclose = (e) => console.log("发送通道关闭", e);
    // 通道打开事件
    this.webrtcSendChannel.onopen = () => {
      // 发送ping
      _this.webrtcSendChannel.send("ping");
      _this.webrtcSendChannelInterval = setInterval(() => {
        // 发送心跳包
        _this.webrtcSendChannel.send("ping");
      }, 1000);
    };
    // 收到消息事件
    this.webrtcSendChannel.onmessage = (e) => console.log(e.data);
  }
  async handleNegotiationNeeded() {
    const _this = this;
    // 启动创建SDP提议，以启动到远程对等点的新 WebRTC 连接。
    const offer = await _this.webrtc.createOffer();
    // 更改与连接关联的本地描述
    await _this.webrtc.setLocalDescription(offer);
    Server.get_webrtc(
      _this.stream_id,
      new URLSearchParams({
        data: btoa(_this.webrtc.localDescription.sdp),
      })
    )
      .then((response) => response.data)
      .then((data) => {
        try {
          // 将指定的会话描述设置为远程对等方的当前会议或应答
          _this.webrtc.setRemoteDescription(
            new RTCSessionDescription({
              type: "answer",
              sdp: atob(data),
            })
          );
        } catch (e) {
          // console.log(e);
          // debugger;
          alert("视频加载失败");
          if (_this.onClosePlay) {
            _this.onClosePlay();
          }
        }
      })
      .catch(function (error) {
        alert("未找到视频源");
        if (_this.onClosePlay) {
          _this.onClosePlay();
        }
      });
  }
  destroy() {
    if (this.ishistory) {
      if (this.hls) {
        this.hls.destroy();
      }
      this.ishistory = false;
      Server.del_history(this.hisstream_id);
    } else {
      clearInterval(this.webrtcSendChannelInterval);
      this.webrtc.close();
    }
    this.video.srcObject = null;
    if (this.loader && !("d-none" in this.loader.classList))
      this.loader.className += " d-none";
  }
}
