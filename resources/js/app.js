//require('./bootstrap');

import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css';

import Vue from 'vue'
import Vuetify from 'vuetify'
import MainComponent from '../js/components/MainComponent'
import store from './store/main'

Vue.config.productionTip = false;
Vue.use(Vuetify);

new Vue({
    el: '#app',
    //router,
    vuetify: new Vuetify(),
    store,
    template: '<main-component/>',
    components: { MainComponent },
});

