import instance from "@/utils/request";

export function RoleCreate(data = {}) {
  return instance.request({
    method: "post",
    url: "/role/create",
    data,
  });
}

export function RoleDetailed(data = {}) {
  return instance.request({
    method: "post",
    url: "/role/detailed",
    data,
  });
}

export function RoleUpdate(data = {}) {
  return instance.request({
    method: "post",
    url: "/role/update",
    data,
  });
}

export function RoleListAll(data = {}) {
  return instance.request({
    method: "post",
    url: "/role/all",
    data,
  });
}
