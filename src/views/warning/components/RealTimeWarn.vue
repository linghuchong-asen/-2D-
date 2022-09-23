<template>
  <li v-for="item in warnList" :key="item.targetId" class="warn">
    <div
      class="warnInfo"
      @selectstart.prevent
      @click="clickBorder"
      @dblclick="dblClickBorder"
    >
      <div class="float">
        <span>告警防区:</span>
        <span>{{ item.warnRange }}</span>
      </div>
      <div class="float warnTime">
        <span>告警时长:</span>
        <span>{{ item.warnTimeLong }}秒钟</span>
      </div>
      <div class="float checkbox">
        <el-checkbox v-model="trackShows" label="显示轨迹" size="large" />
        <el-checkbox v-model="targetTracking" label="目标跟踪" size="large" />
      </div>
    </div>
  </li>
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect, watch } from "vue";
import type { RTData, WarnData } from "./realTime";
import { createAlarmWs } from "../websocket";

// websocket推送的实时报警数据
const warnData = reactive<RTData>({});
// 建立websocket链接
createAlarmWs(warnData);
// 实时报警信息v-for绑定的数据
const warnList = reactive<
  {
    warnRange: string;
    warnTimeLong: number;
    targetId: string;
    warnTime: string;
  }[]
>([]);
// 告警id
const alarmId = ref<string>("");
const alarmIdArr: string[] = [];
// warnData长度
let warnDataLength: number;
// 后端返回的非空值
let warnReal: WarnData;
// 侦听warnData变化，对alarmId进行赋值
watchEffect(() => {
  /* watchEffect中必须是依赖的状态变化时，才会执行里面的语句；只有一句console.log语句，是不会执行的；
  但是加上const length = Object.keys(warnData).length语句就会变化，因为warnData作为依赖的状态了 */
  // console.log(warnData.);
  warnDataLength = Object.keys(warnData).length;
  if (warnDataLength !== 0) {
    warnReal = warnData as WarnData;
    alarmId.value = warnReal.AlarmInfos[0].obj_id;
    /* watch相对于watchEffect更适合的场景:watchEffect会监听内部所有依赖的状态，比如这里只要warnData变化就会执行里面的语句，
    而下面的watch(alarmId,()=>{}) 则可以只侦听alarmId的变化，更加精准，更适合这种当某一个值变化时执行副租用的场景*/
    // console.log("watchEffect");

    console.log("alarmId变化");

    // 判断alarmId是否已经存在于alarmIdArr数组中，不存在时增加一条新的告警信息，存在时增加读秒
    const hasId = alarmIdArr.some((item) => item === alarmId.value);
    if (!hasId) {
      console.log("增加告警信息");
      alarmIdArr.push(alarmId.value);
      warnList.push({
        warnRange: warnReal.AlarmInfos[0].alarmarea_name,
        warnTimeLong: 0,
        targetId: warnReal.AlarmInfos[0].obj_id,
        warnTime: warnReal.AlarmInfos[0].timestamp.slice(-6, -4),
      });
    } else {
      console.log("增加读秒");
      const warnItem = warnList.find((item) => item.targetId === alarmId.value);

      if (warnItem) {
        // console.log(parseFloat(warnReal.AlarmInfos[0].timestamp.slice(-6, -4)));
        // console.log(parseFloat(warnItem.warnTime));
        warnItem.warnTimeLong = Math.floor(
          parseFloat(warnReal.AlarmInfos[0].timestamp.slice(-6, -4)) -
            parseFloat(warnItem.warnTime)
        );
      }
    }

    // 判断alarmArr数组中的item是否在推送的告警中，如果间隔5秒都没有推送信息，则删除该item项
  }
});
// 侦听alarmId状态，向warnList数组中添加值
/* watch(alarmId, () => {
  console.log("alarmId变化");
  // 判断alarmId是否已经存在，不存在时增加一条新的告警信息，存在时增加读秒
  const hasId = alarmIdArr.some((item) => item === alarmId.value);
  if (!hasId) {
    console.log("增加告警信息");
    alarmIdArr.push(alarmId.value);
    warnList.push({
      warnRange: warnReal.AlarmInfos[0].alarmarea_name,
      warnTimeLong: 0,
      targetId: warnReal.AlarmInfos[0].obj_id,
      warnTime: warnReal.AlarmInfos[0].timestamp.slice(-6, -4),
    });
  } else {
    console.log("增加读秒");
    const warnItem = warnList.find((item) => item.targetId === alarmId.value);

    if (warnItem) {
      console.log(parseFloat(warnReal.AlarmInfos[0].timestamp.slice(-6, -4)));
      console.log(parseFloat(warnItem.warnTime));
      warnItem.warnTimeLong =
        parseFloat(warnReal.AlarmInfos[0].timestamp.slice(-6, -4)) -
        parseFloat(warnItem.warnTime);
    }
  }
}); */

// 显示轨迹  目标跟踪
const trackShows = ref(true);
const targetTracking = ref(false);

// 告警信息边框颜色 #f9ca24 #ff4757
const warnInfoBorder = ref<string>("#106898");
// 单击告警信息，出现黄色边框
const clickBorder = () => (warnInfoBorder.value = "#f9ca24");
// 单击告警信息，出现黄色边框
const dblClickBorder = () => (warnInfoBorder.value = "#ff4757");
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
  border: 2px solid v-bind(warnInfoBorder);

  .warnTime {
    margin-left: 0.5rem;
    margin-right: 0.3125rem;
  }

  .checkbox {
    /deep/ .el-checkbox--large {
      height: 100% !important;
      color: #fff;
    }
    /deep/ .is-checked .el-checkbox__label {
      color: #cc0250;
    }
  }
}
</style>
