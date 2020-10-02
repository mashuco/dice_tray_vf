import Vue from "vue"
import axios from 'axios'

export default  {
  axsiosInitialWithTwToken(){
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
  axsiosInitial(twLinkedAuthKey){
    if(twLinkedAuthKey =! null){
      axios.defaults.headers.common['Authorization'] = "Token " + twLinkedAuthKey
      console.log("twLinkedAuthKey")
      console.log(twLinkedAuthKey)
      
    }
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


