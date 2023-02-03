import { createStore } from "vuex";
import app from "./modules/app";
import info from "./modules/info";

export default createStore({
  modules: {
    app,
    info,
  },
});
