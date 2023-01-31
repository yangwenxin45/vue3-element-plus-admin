import Cookies from "js-cookie";

const tokenKey = "tokenAdmin";
const userNameKey = "username";

export function getToken() {
  return Cookies.get(tokenKey);
}
export function setToken(value) {
  Cookies.set(tokenKey, value);
}
export function removeToken() {
  Cookies.remove(tokenKey);
}

export function setUsername(value) {
  Cookies.set(userNameKey, value);
}
export function getUsername() {
  return Cookies.get(userNameKey);
}
export function removeUsername() {
  Cookies.remove(userNameKey);
}
