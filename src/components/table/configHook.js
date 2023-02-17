import { reactive } from "vue";

export function configHook() {
  const config = reactive({
    selection: true, // 配置复选框
    batch_delete: true, // 批量删除按钮
    pagination: true, // 分页
    search: true,
    action_request: false,
    row_key: "id",
    expand_all: true,
  });

  const configInit = (data = {}) => {
    if (JSON.stringify(data) === "{}") {
      return false;
    }
    const keys = Object.keys(config);
    for (let key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }
      if (keys.includes(key)) {
        config[key] = data[key];
      }
    }
  };

  return {
    config,
    configInit,
  };
}
