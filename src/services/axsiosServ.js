import Vue from "vue"
import axios from 'axios'

export default  {
  axsiosInitial(twLinkedAuthKey){
    var tmp = '7664128f7fc2ff85810196feab5c7766eb596c54'
    axios.defaults.headers.common['Authorization'] =`Bearer ${tmp}`
    Vue.prototype.$axios = axios.create({ 
      baseURL:  process.env.VUE_APP_URL,
      auth: {
        username: process.env.VUE_APP_BASIC_USER ,
        password: process.env.VUE_APP_BASIC_PASS
      }, 
      headers: {
        "Content-Type": "application/json",
      }
    })            
  }
 
}


