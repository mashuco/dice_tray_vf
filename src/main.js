import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './plugins/element.js'

import axios from 'axios'
import './plugins/element.js'

Vue.config.productionTip = false


new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')


//axios.defaults.baseURL = 'https://www.acot.biz/api'
axios.defaults.baseURL = 'http://localhost:8000/api'
