import Vue from 'vue'
import App from './App.vue'

import router from './router'

import store from './store'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './plugins/element.js'
Vue.config.productionTip = false
Vue.config.debug = false



new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')

