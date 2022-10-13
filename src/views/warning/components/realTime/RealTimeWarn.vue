<template>
  <li
    v-for="item in warnList"
    :key="item.alarmId"
    :class="warnInfoBorder"
    @click="clickBorder(item.defenceAreaId)"
    @dblclick="dblClickBorder"
  >
    <div class="warnInfo" @selectstart.prevent>
      <div class="float">
        <span>告警防区:</span>
        <span>{{ item.warnRange }}</span>
      </div>
      <div class="float warnTime" v-if="item.isRadar">
        <span>告警时长:</span>
        <span>{{ (item as RadarWarnList).warnTimeLong }}秒</span>
      </div>
      <div class="float warnTime" v-if="!item.isRadar">
        <span>触发时间:</span>
        <span>{{ item.attackTime }}</span>
      </div>
      <div class="float checkbox" v-if="item.isRadar">
        <el-checkbox v-model="trackShows" label="显示轨迹" size="large" />
        <el-checkbox v-model="targetTracking" label="目标跟踪" size="large" />
      </div>
    </div>
  </li>
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect } from "vue";
import type {
  RTData,
  WarnData,
  IOWarn,
  RadarWarnList,
  IOWarnList,
} from "./realTime";
import { createRealTimeAlarmWs, createIOAlarmWs } from "../../server";
import { clickEvent } from "./components/realTimeFun";

// websocket推送的雷达目标实时报警数据
const warnData = reactive<RTData>({});
// 建立websocket链接
createRealTimeAlarmWs(warnData);

// 实时报警信息v-for绑定的数据（雷达目标与IO设备）
const warnList = reactive<RadarWarnList[] | IOWarnList[] | []>([]);

// 告警id
const alarmId = ref<string>("");
// 用于判断websocket停止推送
const stopPushFlag = false;
// warnData长度
let warnDataLength: number;
// 后端返回的非空值
let warnReal: WarnData;
// 清除warnList定时器
let deleteWarnTimer: ReturnType<typeof setTimeout>;
// 读秒定时器
let secondsTimer: ReturnType<typeof setTimeout>;
// 间隔1秒没有推送，停止读秒
let stopSecond: ReturnType<typeof setTimeout>;

// 侦听warnData变化，对alarmId进行赋值
watchEffect(() => {
  warnDataLength = Object.keys(warnData).length;
  if (warnDataLength !== 0) {
    warnReal = warnData as WarnData;
    alarmId.value = warnReal.AlarmInfos[0].obj_id;
    const radarWarnList = warnList as RadarWarnList[];

    // 有告警信息在推送
    if (!stopPushFlag) {
      // 判断alarmId是否已经存在于alarmIdArr数组中，不存在时增加一条新的告警信息，存在时增加读秒
      const hasId = radarWarnList.find(
        (item) => item.alarmId === alarmId.value
      );
      if (!hasId) {
        // "增加告警信息"
        radarWarnList.push({
          isRadar: true,
          warnRange: warnReal.AlarmInfos[0].alarmarea_name,
          warnTimeLong: 0,
          alarmId: warnReal.AlarmInfos[0].obj_id,
          secondsIncreaseFlag: true,
          lastTime: new Date().getTime(),
          defenceAreaId: warnReal.AlarmInfos[0].alarmarea_id.toString(),
          attackTime: warnReal.AlarmInfos[0].timestamp.slice(10, -4),
        });
      } else {
        /* 告警已经存在于warnList中，增加读秒；这里并未处理读秒，下面的setTimeout用于处理读秒；
        这里更新warnList的lastTime用于之后的间隔5秒没有推送告警删除功能 */
        hasId.lastTime = new Date().getTime();
        hasId.secondsIncreaseFlag = true;
      }

      // 告警删除逻辑：1.告警还在推送中，判断warnList数组中的item是否在推送的告警中，如果间隔5秒都没有推送信息，则删除该item项
      const notPush = radarWarnList.filter(
        (item) => item.alarmId !== alarmId.value
      ); // warnList中告警id不等于websocket推送告警id的数组

      if (notPush.length !== 0) {
        notPush.forEach((item) => {
          const nowDate = new Date().getTime();
          const timeInterval = nowDate - item.lastTime;
          // 间隔5秒没有推送，删除该项
          if (timeInterval > 50000) {
            const index = radarWarnList.findIndex(
              (value) => value.alarmId === item.alarmId
            );
            warnList.splice(index, 1);
          }
          // 间隔1秒没有推送，停止读秒
          if (timeInterval > 1000) {
            radarWarnList.forEach((value) => {
              if (value.alarmId === item.alarmId)
                value.secondsIncreaseFlag = false;
            });
          }
        });
      }
    }

    /* 当没有告警推送，间隔1秒没有推送，停止读秒 */
    clearTimeout(stopSecond);
    stopSecond = setTimeout(() => {
      radarWarnList.forEach((value) => {
        value.secondsIncreaseFlag = false;
      });
    }, 1000);

    // 告警删除逻辑：2.全部告警停止推送，把warnList数组清空
    /* clearTimeout(deleteWarnTimer);
    deleteWarnTimer = setTimeout(() => {
      stopPushFlag = true;
      warnList.splice(0, radarWarnList.length);
    }, 1000 * 5); */
  }
});

/* 雷达目标告警读秒增加,单纯的处理读秒增加功能，为了能够获得准确的1秒钟；
根据websocket每推送一条数据增加1，后端推送到前端的时间有快有慢不能保证准确的1秒钟 */
const secondsFun = () => {
  clearTimeout(secondsTimer);
  secondsTimer = setTimeout(() => {
    if (warnList.length !== 0) {
      if (warnList[0].isRadar) {
        const radarWarnList = warnList as RadarWarnList[];
        radarWarnList.forEach((item) => {
          if (item.secondsIncreaseFlag) item.warnTimeLong++;
        });
      }
    }

    secondsFun();
  }, 1000);
};
secondsFun();

/*  ---------------------IO设备告警逻辑部分------------------------------------ */
// IO设备告警
const IOWarnData = reactive<IOWarn | object>({});
// 建立IO设备告警websocket链接
createIOAlarmWs(IOWarnData);
watchEffect(() => {
  const dataLength = Object.keys(IOWarnData).length;
  console.log("雷达目标告警是否会触发IO设备告警");
  if (dataLength !== 0) {
    const IOWarnRealData = (IOWarnData as IOWarn).AlarmInfos;
    const ioWarnList = warnList as IOWarnList[];
    const hasId = warnList.some(
      (item) => item.alarmId === IOWarnRealData.obj_id
    );
    if (!hasId) {
      ioWarnList.push({
        isRadar: false,
        warnRange: IOWarnRealData.alarmarea_name,
        alarmId: IOWarnRealData.obj_id,
        defenceAreaId: IOWarnRealData.alarmarea_id.toString(),
        attackTime: IOWarnRealData.attacktime,
      });
    }

    // 当IO设备报警条数超过20条时，把最前面的告警删除
    const IOWarnCount = warnList.filter(
      (item) => item.isRadar === false
    ).length;
    if (IOWarnCount > 20) {
      const index = warnList.findIndex((item) => item.isRadar === false);
      warnList.splice(index, 1);
    }
  }
});

// 显示轨迹  目标跟踪
const trackShows = ref(true);
const targetTracking = ref(false);

// 告警信息边框颜色 #f9ca24 #ff4757
const warnInfoBorder = reactive<string[]>(["warn"]);

// 单击告警信息，出现黄色边框；播放对应雷达关联相机的视频
const clickBorder = async (defenceAreaId: string) => {
  warnInfoBorder.splice(0, warnInfoBorder.length).push("warn", "clickBorder");
  clickEvent(defenceAreaId);
};

// 双击告警信息，出现红色边框
const dblClickBorder = () =>
  warnInfoBorder
    .splice(0, warnInfoBorder.length)
    .push("warn", "dblClickBorder");
</script>
<style lang="less" scoped>
.float {
  float: left;
}
.warn {
  display: flex;
  box-sizing: border-box;
  width: 49%;
  padding-left: 0.3125rem;
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  margin-bottom: 0.3125rem;
  margin-left: 0.3125rem;
  border-radius: 0.3125rem;
  background: linear-gradient(135deg, #abdcff, #0396ff);
  font-size: 0.875rem;
  cursor: pointer;

  .warnTime {
    margin-left: 0.5rem;
    margin-right: 0.3125rem;
  }

  .checkbox {
    ::v-deep .el-checkbox--large {
      height: 100% !important;
      color: #fff;
    }
    ::v-deep .is-checked .el-checkbox__label {
      color: #cc0250;
    }
  }
}
.clickBorder {
  border: 2px solid #f9ca24;
}
.dblClickBorder {
  border: 2px solid #ff4757;
}
</style>
