// 操作日志表单绑定数据
export interface OperationQueryForm {
  type?: string;
  name?: string;
  startTime?: string;
  endTime?: string;
}
// 操作日志表单提交数据
export interface OperationQueryData {
  startdatetime?: [string, string];
  operation_category?: string; // 操作类型
  username?: string; // 用户名
  page: number;
  page_size: number;
}

// 交接班日志表单绑定数据
export interface RelieveQueryForm {
  startTime?: string;
  endTime?: string;
}
