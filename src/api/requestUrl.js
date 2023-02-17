const apiUrl = {
  info: {
    list: {
      url: "/news/getList/",
      method: "post",
    },
    info_status: {
      url: "/news/status/",
      method: "post",
    },
    delete: {
      url: "/news/delete/",
      method: "post",
    },
  },
  cascader: {
    category: {
      url: "/news/getCategoryAll/",
      method: "post",
    },
  },
  menu: {
    list: {
      url: "/menu/lists",
      // url: "/menu/listsTree",
      method: "post",
    },
    delete: {
      method: "post",
      url: "/menu/remove",
    },
    hidden_status: {
      url: "/menu/statusHidden",
      method: "post",
    },
    disabled_status: {
      url: "/menu/statusDisabled",
      method: "post",
    },
  },
  role: {
    list: {
      url: "/role/lists",
      method: "post",
    },
    status: {
      url: "/role/status",
      method: "post",
    },
    delete: {
      method: "post",
      url: "/role/delete",
    },
  },
  user: {
    list: {
      url: "/user/lists",
      method: "post",
    },
    status: {
      url: "/user/status",
      method: "post",
    },
    delete: {
      url: "/user/remove",
      method: "post",
    },
  },
};

export default apiUrl;
