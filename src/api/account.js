import instance from "@/utils/request";

export function Register(data = {}) {
  return instance.request({
    method: "post",
    url: "/register/",
    data,
  });
}

export function Login(data = {}) {
  return instance.request({
    method: "post",
    url: "/login/",
    data,
  });
}

export function Logout(data = {}) {
  return instance.request({
    method: "post",
    url: "/logout/",
    data,
  });
}
