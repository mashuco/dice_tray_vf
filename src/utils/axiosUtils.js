import Vue from "vue"
import axios from 'axios'

export default  {
  axiosInitial(){
    Vue.prototype.$axios = axios.create({ 
      baseURL:  process.env.VUE_APP_URL,
    })            
  },
  axiosInitialTw(twLinkedAuthKey){
    axios.defaults.headers.common['authorization'] = "Token " + twLinkedAuthKey
    Vue.prototype.$axios = axios.create({ 
      baseURL:  process.env.VUE_APP_URL,
    })            
  },
  axiosInitialBasic(){
    Vue.prototype.$axios = axios.create({ 
      baseURL:  process.env.VUE_APP_URL,
      auth: {
       username: process.env.VUE_APP_BASIC_USER ,
       password: process.env.VUE_APP_BASIC_PASS
      }, 
    })            
  }
}


