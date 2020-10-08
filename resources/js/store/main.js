import Vue from 'vue'
import Vuex from 'vuex'
import employees from "./modules/employees";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        employees
    },
    strict: debug,
});
