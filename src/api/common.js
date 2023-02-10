import instance from "@/utils/request";

export function GetCode(data) {
  return instance.request({
    method: "post",
    url: "/getCode/",
    data,
  });
}

export function ErrorHttp(data) {
  return instance.request({
    method: "post",
    url: "/error/",
    data,
  });
}

export function UploadFile(data = {}) {
  return instance.request({
    method: "post",
    url: "/upload",
    data,
  });
}

export function TableData(params = {}) {
  return instance.request({
    method: params.method,
    url: params.url,
    data: params.data,
  });
}

export function SwitchStatus(params = {}) {
  return instance.request({
    method: params.method,
    url: params.url,
    data: params.data,
  });
}

export function CommonApi(params = {}) {
  return instance.request({
    method: params.method,
    url: params.url,
    data: params.data,
  });
}
