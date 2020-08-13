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
//firebase.initializeApp(process.env.VUE_APP_FIREBASE_CONFIG)
var firebaseConfig = {
  apiKey: "AIzaSyBCtkiqT0oEBhTUf0myLAda9TFnAInET1o",
  authDomain: "dice-adab6.firebaseapp.com",
  databaseURL: "https://dice-adab6.firebaseio.com",
  projectId: "dice-adab6",
  storageBucket: "dice-adab6.appspot.com",
  messagingSenderId: "178770782401",
  appId: "1:178770782401:web:f760e833ea5e0343f20c40"
};
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')



