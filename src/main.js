import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.config.productionTip = false
Vue.config.debug = true
Vue.config.solo_mode = true

Vue.prototype.$axios = axios.create({ 
  baseURL:  process.env.VUE_APP_URL,
  auth: {
    username: process.env.VUE_APP_BASIC_USER ,
    password: process.env.VUE_APP_BASIC_PASS
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')

