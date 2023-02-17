import { reactive, getCurrentInstance } from "vue";
import { TableData, CommonApi } from "@/api/common";
import ApiUrl from "@/api/requestUrl";

export function requestHook() {
  const { proxy } = getCurrentInstance();
  const table_data = reactive({
    data: [],
    total: 0,
    loading: false,
    data_id: "",
  });

  let request_config = {
    has: true,
    url: "",
    method: "post",
    data: {},
    delete_key: "id",
    search_params: {},
    format_data: null,
  };

  const loadData = () => {
    table_data.loading = true;
    if (!request_config.has) {
      return false;
    }
    if (!request_config.url) {
      return false;
    }

    // 参数
    const url = ApiUrl[request_config.url]?.list?.url;
    const method = ApiUrl[request_config.url]?.list?.method || "post";
    const data = request_config.data;

    const request_data = {
      url,
      method,
      data: {
        ...request_config.data,
        ...request_config.search_params,
      },
    };
    // 调用接口
    return new Promise((resolve, reject) => {
      TableData(request_data)
        .then((response) => {
          let response_data = response.data.data;
          console.log(response_data);
          // 是否格式化数据
          if (
            request_config.format_data &&
            Object.prototype.toString.call(request_config.format_data) ===
              "[object Function]"
          ) {
            response_data = request_config.format_data(response.data.data);
          }
          console.log(response_data);

          table_data.data = response_data;
          table_data.total = response.data.total;
          table_data.loading = false;
          resolve(table_data.data);
        })
        .catch((error) => {
          table_data.loading = false;
        });
    });
  };

  const requestData = (data = {}, type = "init") => {
    if (type === "init") {
      request_config = {
        ...request_config,
        ...data,
      };
    }
    if (type === "page") {
      request_config.data = {
        ...request_config.data,
        ...data,
      };
    }

    if (type === "search") {
      request_config.data.pageNumber = 1;
      request_config.data.pageSize = 10;
      request_config.search_params = data;
    }

    return loadData();
  };

  const saveDataId = (value) => {
    const isArray = Array.isArray(value);
    if (!isArray) {
      table_data.data_id = value[request_config.delete_key];
    } else {
      table_data.data_id =
        value.length > 0
          ? value.map((item) => item[request_config.delete_key]).join()
          : "";
    }
  };

  const handlerDeleteConfirm = () => {
    proxy.deleteConfirm({
      title: "删除",
      message: "确认删除当前数据吗？",
      thenFun: () => {
        return handlerDelete();
      },
    });
  };

  const handlerDelete = () => {
    const url = ApiUrl?.[request_config.url]?.delete?.url;
    const method = ApiUrl?.[request_config.url]?.delete?.method || "post";
    if (!url) {
      console.log("未配置删除接口参数");
      return false;
    }
    const request_data = {
      url,
      method,
      data: {
        [request_config.delete_key]: table_data.data_id,
      },
    };
    return new Promise((resolve, reject) => {
      CommonApi(request_data)
        .then((response) => {
          ElMessage({
            message: response.message,
            type: "success",
          });
          loadData();
          table_data.data_id = "";
          resolve();
        })
        .catch((error) => {
          reject();
        });
    });
  };

  return {
    table_data,
    requestData,
    saveDataId,
    handlerDeleteConfirm,
  };
}
