import instance from "@/utils/request";

export function UserCreate(data = {}) {
  return instance.request({
    method: "post",
    url: "/user/create",
    data,
  });
}

export function UserDetailed(data = {}) {
  return instance.request({
    method: "post",
    url: "/user/detailed",
    data,
  });
}

export function UserUpdate(data = {}) {
  return instance.request({
    method: "post",
    url: "/user/update",
    data,
  });
}

export function UpdatePass(data = {}) {
  return instance.request({
    method: "post",
    url: "/user/password",
    data,
  });
}
