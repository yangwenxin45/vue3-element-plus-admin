import axios from "axios";
import { getToken, getUsername, removeToken, removeUsername } from "./cookies";
import router from "@/router";

console.log(process.env.VUE_APP_API);

// 创建实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 设置请求头
    if (getToken()) {
      config.headers["Token"] = getToken();
    }
    if (getUsername()) {
      config.headers["Username"] = getUsername();
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    const data = response.data;
    if (data.resCode === 0) {
      return Promise.resolve(data);
    } else {
      ElMessage({
        message: data.message,
        type: "error",
      });
      return Promise.reject(data);
    }
  },
  function (error) {
    const errorData = JSON.parse(error.request.response);
    if (errorData.message) {
      ElMessage({
        message: errorData.message,
        type: "error",
      });
    }
    // token失效自动退出
    if (errorData.resCode === 1010) {
      router.replace({
        name: "Login",
      });
      removeToken();
      removeUsername();
    }
    // 对响应错误做点什么
    return Promise.reject(errorData);
  }
);

// 暴露service
export default instance;
