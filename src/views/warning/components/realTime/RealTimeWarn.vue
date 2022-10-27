<!--
 * @Description: 实时告警组件
 * @Author: yangsen
 * @Date: 2022-09-08 17:14:18
 * @LastEditors: yangsen
 * @LastEditTime: 2022-10-24 20:06:58
-->
<template>
  <li
    v-for="(item, index) in warnList"
    :key="item.alarmId"
    :class="currentIndex === index ? warnInfoBorder : 'warn'"
    @click="clickBorder(item.defenceAreaId, index, item.alarmId)"
    @dblclick="
      dblClickBorder(item.defenceAreaId, item.alarmType, item.alarmId, index)
    "
  >
    <div class="warnInfo" @selectstart.prevent>
      <div class="float">
        <span>告警防区: </span>
        <span>{{ item.warnRange }}</span>
      </div>
      <div class="float warnTime" v-if="item.isRadar">
        <span>告警时长: </span>
        <span>{{ (item as RadarWarnList).warnTimeLong }}秒</span>
      </div>
      <div class="float warnTime" v-if="!item.isRadar">
        <span>触发时间: </span>
        <span>{{ item.attackTime }}</span>
      </div>
      <div class="float checkbox" v-if="item.isRadar">
        <el-checkbox v-model="trackShows" label="显示轨迹" size="large" />
        <el-checkbox v-model="targetTracking" label="目标跟踪" size="large" />
      </div>
    </div>
  </li>
  <!-- 双击告警出现的处置弹窗 -->
  <div class="handleWarn">
    <el-dialog
      v-model="handleWarnVisible"
      title="告警处置"
      width="20%"
      :modal="false"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="true"
        :model="handleWarnData"
        ref="handleWarnInstance"
        :rules="handelWarnRule"
      >
        <el-form-item label="处置类型: " prop="type">
          <el-select
            v-model="handleWarnData.type"
            placeholder="请选择处置类型"
            size="small"
            class="selectLength"
          >
            <el-option label="忽略" value="忽略" />
            <el-option label="人工处置" value="人工处置" />
          </el-select>
        </el-form-item>
        <el-form-item label="处置描述: " prop="description">
          <el-input
            v-model="handleWarnData.description"
            :rows="2"
            type="textarea"
            placeholder="请输入处置描述"
          />
        </el-form-item>
        <el-form-item label="处置方式: " prop="mode">
          <el-radio-group v-model="handleWarnData.mode" class="ml-4">
            <el-radio :label="1" size="large">消音</el-radio>
            <el-radio :label="2" size="large">消警</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleWarnSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
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
import {
  createRealTimeAlarmWs,
  createIOAlarmWs,
  handleWarnSever,
} from "../../server";
import { clickEvent } from "./components/realTimeFun";
import { ElMessage, type FormInstance } from "element-plus";
import { getFormateTime } from "@/utils/index";
import { useWarnStore } from "@/stores/warnStore";
import { useSystemStore } from "@/stores/systemStore";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { setTrgtData, setMapCenterPoint } from "@/views/map/public/map.js";

// pinia定义的全局状态，储存告警防区的防区id
const warnStore = useWarnStore();

// 系统配置全局状态
const systemStore = useSystemStore();

// websocket推送的雷达目标实时报警数据
const warnData = reactive<RTData>({});
// 建立websocket链接
createRealTimeAlarmWs(warnData);

// 实时报警信息v-for绑定的数据（雷达目标与IO设备）
const warnList = reactive<RadarWarnList[] | IOWarnList[] | []>([]);

// 告警id
const alarmId = ref<string>("");
// 选中目标跟踪的告警信息对应id
const selectedId = ref<string>("");
// 防区id
const defenceId = ref<number>(-1);
// 防区类型 0 雷达告警 1海防  2.io告警
const alarmTypeRef = ref<number>(-1);
// 用于判断websocket停止推送
let stopPushFlag = false;
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

/* -----------目标告警---------------- */
watchEffect(() => {
  warnDataLength = Object.keys(warnData).length;
  if (warnDataLength !== 0) {
    warnReal = warnData as WarnData;
    // 侦听warnData变化，对alarmId进行赋值
    alarmId.value = warnReal.AlarmInfos[0].obj_id;
    const radarWarnList = warnList as RadarWarnList[];

    /*  ----选中显示轨迹----- */
    // 告警轨迹显示的标识 id+方向+速度
    const text = `${alarmId.value}`;
    // 告警点坐标
    const geoData = warnReal.AlarmInfos[0].geometry.slice(7, -6).split(" ");
    if (trackShows.value) setTrgtData(alarmId.value, text, geoData);

    /* -------目标跟踪----------- */
    const isSelectedFlag =
      warnReal.AlarmInfos[0].obj_id === selectedId.value ? true : false;
    if (isSelectedFlag && targetTracking.value)
      setMapCenterPoint(
        warnReal.AlarmInfos[0].geometry.slice(7, -6).split(" ")
      );

    // 有告警信息在推送
    if (!stopPushFlag) {
      // 判断alarmId是否已经存在于alarmIdArr数组中，不存在时增加一条新的告警信息，存在时增加读秒
      const hasId = radarWarnList.find(
        (item) => item.alarmId === alarmId.value
      );

      // 判断alarmId是否存在于告警处置成功数组中，不存在时增加一条
      const isHandleId = dblSuccessId.some((item) => item === alarmId.value);

      if (!hasId && !isHandleId) {
        // "增加告警信息"
        radarWarnList.push({
          isRadar: true,
          warnRange: warnReal.AlarmInfos[0].alarmarea_name,
          warnTimeLong: 0,
          alarmId: warnReal.AlarmInfos[0].obj_id,
          secondsIncreaseFlag: true,
          lastTime: new Date().getTime(),
          defenceAreaId: warnReal.AlarmInfos[0].alarmarea_id,
          attackTime: warnReal.AlarmInfos[0].timestamp.slice(10, -4),
          alarmType: 0,
        });

        // 增加告警中防区id
        warnStore.warningList.push(warnReal.AlarmInfos[0].alarmarea_id);
      }

      if (hasId) {
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
          // 间隔系统配置自动秒数没有推送，删除该项
          if (timeInterval > systemStore.deleteWarn * 1000) {
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

          // 间隔1秒没有推送，删除告警中id
          if (timeInterval > 1000) {
            const index = warnStore.warningList.findIndex(
              (value: number) => value === item.defenceAreaId
            );
            warnStore.warningList.splice(index, 1);
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
    clearTimeout(deleteWarnTimer);
    deleteWarnTimer = setTimeout(() => {
      stopPushFlag = true;
      warnList.splice(0, radarWarnList.length);
    }, 1000 * 5);
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
  if (dataLength !== 0) {
    const IOWarnRealData = (IOWarnData as IOWarn).AlarmInfos;
    const ioWarnList = warnList as IOWarnList[];
    const hasId = warnList.some(
      (item) => item.alarmId === IOWarnRealData.obj_id
    );

    // 增加告警
    if (!hasId) {
      ioWarnList.push({
        isRadar: false,
        warnRange: IOWarnRealData.alarmarea_name,
        alarmId: IOWarnRealData.obj_id,
        defenceAreaId: IOWarnRealData.alarmarea_id,
        attackTime: IOWarnRealData.attacktime,
        alarmType: 2,
      });
    }

    // 增加告警中防区id
    warnStore.warningList.push(IOWarnRealData.alarmarea_id);

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

/* -------------显示轨迹------------------------------------- */
const trackShows = ref(false);

/* ----------目标跟踪----------------------- */
const targetTracking = ref(false);

// 告警信息边框颜色 #f9ca24 #ff4757
const warnInfoBorder = reactive<string[]>(["warn"]);
const currentIndex = ref(0);

/* ------------------单击告警-------------------------- */
let clickTimeout: ReturnType<typeof setTimeout>;
// 单击告警信息，出现黄色边框；播放对应雷达关联相机的视频
const clickBorder = (defenceAreaId: number, index: number, alarmId: string) => {
  // 设置选中告警信息对应告警id
  selectedId.value = alarmId;
  clearTimeout(clickTimeout);
  if (!(trackShows.value || targetTracking.value)) {
    clickTimeout = setTimeout(() => {
      currentIndex.value = index;

      warnInfoBorder.splice(0, warnInfoBorder.length);
      warnInfoBorder.push("warn", "clickBorder");

      clickEvent(defenceAreaId);
    }, 300);
  }
};

/* ----------------双击告警------------------------------------ */
const handleWarnVisible = ref(false);

// 处置表单引用实例
const handleWarnInstance = ref<FormInstance>();

// 处置表单数据
const handleWarnData = reactive({
  type: "",
  description: "",
  mode: 0,
});

// 处置表单校验规则
const handelWarnRule = {
  type: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  description: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  mode: [{ required: true, message: "此项为必填项", trigger: "blur" }],
};

// 双击告警的id
const dblAlarmId = ref("");

// 告警双击事件
const dblClickBorder = (
  defenceAreaId: number,
  alarmType: number,
  alarmId: string,
  index: number
) => {
  defenceId.value = defenceAreaId;
  alarmTypeRef.value = alarmType;
  dblAlarmId.value = alarmId;

  // 清除表单
  handleWarnInstance.value?.resetFields();

  // 清除单击事件
  clearTimeout(clickTimeout);

  // 出现红色边框
  currentIndex.value = index;
  warnInfoBorder.splice(0, warnInfoBorder.length);
  warnInfoBorder.push("warn", "dblClickBorder");

  // 出现处置弹窗
  handleWarnVisible.value = true;
};

// 处置成功的告警id
const dblSuccessId = reactive<string[]>([]);

// 告警处置表单提交
const handleWarnSubmit = () => {
  if (!handleWarnInstance.value) {
    return;
  } else {
    handleWarnInstance.value.validate(async (valid: boolean, invalidFields) => {
      if (valid) {
        // 发送处置表单
        try {
          const param = {
            alarmtype: alarmTypeRef.value.toString(), // 告警类型 0 雷达告警 1海防  2.io告警
            cfmdesc: handleWarnData.description, // 处置描述
            cfmtime: getFormateTime(), // 处置时间
            cfmtype: handleWarnData.type, // 处置类型
            obj_id: dblAlarmId.value, // 告警编号
            type: handleWarnData.mode, // 消音/消警
            area: defenceId.value, // 防区id
          };
          const serverData = await handleWarnSever(param);
          const { data, status } = serverData;
          if (status === 201) {
            ElMessage({ type: "success", message: "处置告警成功" });
            handleWarnVisible.value = false;

            // 告警处置成功，向告警处置成功的数组中添加id
            dblSuccessId.push(dblAlarmId.value);

            // 告警处置成功，删除对应的实时告警
            const index = warnList.findIndex(
              (item) => item.alarmId === dblAlarmId.value
            );
            warnList.splice(index, 1);

            // 告警处置成功，删除对应的告警中防区id
            const i = warnStore.warningList.findIndex(
              (item) => item === defenceId.value
            );
            warnStore.warningList.splice(i, 1);
          } else {
            const errorData = data as { detail: string };
            ElMessage({ type: "error", message: errorData.detail });
          }
        } catch (error) {
          console.error("告警处置出错" + error);
        }
      } else {
        console.error("告警处置表单校验失败" + invalidFields);
      }
    });
  }
};
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
