import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './plugins/element.js'
import axios from 'axios'
import firebase from 'firebase'
import './plugins/element.js'

Vue.config.productionTip = false
Vue.config.debug = true

axios.defaults.baseURL = process.env.VUE_APP_URL
firebase.initializeApp(process.env.VUE_APP_FIREBASE_CONFIG)
firebase.initializeApp(firebaseConfig);  

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')



