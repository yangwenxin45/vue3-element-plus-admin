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
