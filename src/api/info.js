import instance from "@/utils/request";

export function parentCategoryAdd(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/addFirstCategory/",
    data,
  });
}

export function GetCategory(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/getCategoryAll/",
    data,
  });
}

export function ChildCategoryAdd(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    data,
  });
}

export function CategoryEdit(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/editCategory/",
    data,
  });
}

export function CategoryDel(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/deleteCategory/",
    data,
  });
}

export function InfoCreate(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/add/",
    data,
  });
}

export function GetTableList(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/getList/",
    data,
  });
}

export function Status(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/status/",
    data,
  });
}

export function Delete(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/delete/",
    data,
  });
}

export function GetDetailed(data = {}) {
  return instance.request({
    method: "get",
    url: "/news/detailed/",
    params: data,
  });
}

export function InfoEdit(data = {}) {
  return instance.request({
    method: "post",
    url: "/news/editInfo/",
    data,
  });
}
