import { ElMessage } from "element-plus";
import { ref, type Ref } from "vue";

interface ErrorData {
  detail: string;
}

/* ---------------请求后端函数------------------ */
// <SuccessData, Params>为泛型
/*  FIXME:useRequest函数前不要加async，如果加上ts就会要求返回值必须是promise；
    FIXME:为了使用await使用了doRequest添加async */
export const useRequest = <SuccessData, Params>(
  requestFun: (
    params?: Params
  ) => Promise<{ data: SuccessData | ErrorData; status: number }>,
  params?: Params
): Ref<SuccessData | undefined> => {
  // 组合式函数中可以使用状态；状态具有响应式，所以能在return中拿到成功后的值
  const successData = ref<SuccessData>();

  const doRequest = async () => {
    try {
      const defenceGroupData = await requestFun(params);
      const { data, status } = defenceGroupData;
      if (status === 200 || status === 201) {
        successData.value = data as SuccessData;
      } else {
        const errorData = data as ErrorData;
        ElMessage({
          type: "error",
          message: errorData.detail,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  doRequest();
  return successData;
};
