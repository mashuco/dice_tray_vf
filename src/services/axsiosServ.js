import Vue from "vue"
import axios from 'axios'

export default  {
  axsiosInitial(){
    //axios.defaults.headers.common['Authorization'] = "Token " + twLinkedAuthKey
    Vue.prototype.$axios = axios.create({ 
      baseURL:  process.env.VUE_APP_URL,
      //auth: {
      //  username: process.env.VUE_APP_BASIC_USER ,
      //  password: process.env.VUE_APP_BASIC_PASS
      //}, 
      //headers: {
      //  "Content-Type": "application/json",
     // }
    })            
  },
  axsiosInitialTw(twLinkedAuthKey){
    //axios.defaults.headers.common['Authorization'] = "Token " + twLinkedAuthKey
    Vue.prototype.$axios = axios.create({ 
      baseURL:  process.env.VUE_APP_URL,
      //auth: {
      //  username: process.env.VUE_APP_BASIC_USER ,
      //  password: process.env.VUE_APP_BASIC_PASS
      //}, 
      //headers: {
      //  "Content-Type": "application/json",
     // }
    })            
  }
 
}


