import { Login, Logout } from "@/api/account";
import {
  setToken,
  setUsername,
  getToken,
  getUsername,
  removeToken,
  removeUsername,
} from "@/utils/cookies";

const state = {
  collapse: JSON.parse(sessionStorage.getItem("collapse")) || false,
  token: "" || getToken(),
  username: "" || getUsername(),
};
const getters = {};
const mutations = {
  SET_COLLAPSE(state) {
    state.collapse = !state.collapse;
    sessionStorage.setItem("collapse", JSON.stringify(state.collapse));
  },
  SET_TOKEN(state, value) {
    state.token = value;
    value && setToken(value);
  },
  SET_USERNAME(state, value) {
    state.username = value;
    value && setUsername(value);
  },
};
const actions = {
  loginAction(context, requestData) {
    return new Promise((resolve, reject) => {
      Login(requestData)
        .then((response) => {
          let data = response.data;
          // 写入cookies
          context.commit("SET_TOKEN", data.token);
          context.commit("SET_USERNAME", data.username);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logoutAction({ commit }) {
    return new Promise((resolve, reject) => {
      Logout().then((response) => {
        removeToken();
        removeUsername();
        commit("SET_TOKEN", "");
        commit("SET_USERNAME", "");
        resolve(response);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
