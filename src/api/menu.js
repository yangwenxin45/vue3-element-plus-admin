import instance from "@/utils/request";

export function MenuCreate(data = {}) {
  return instance.request({
    method: "post",
    url: "/menu/create",
    data,
  });
}

export function MenuDetailed(data = {}) {
  return instance.request({
    method: "post",
    url: "/menu/detailed",
    data,
  });
}

export function MenuUpdate(data = {}) {
  return instance.request({
    method: "post",
    url: "/menu/update",
    data,
  });
}

export function MenuList(data = {}) {
  return instance.request({
    method: "post",
    url: "/menu/lists",
    data,
  });
}

export function MenuListTree(data = {}) {
  return instance.request({
    method: "post",
    url: "/menu/listsTree",
    data,
  });
}
