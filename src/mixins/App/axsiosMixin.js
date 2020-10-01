import Vue from "vue"
import axios from 'axios'

export default  {
    created:function() {
      this.axsiosInitial()
    },
    data(){
      return{
      }    
    },
    mounted(){
    },
    computed: {
    },
    methods:{
      axsiosInitial(){
        Vue.prototype.$axios = axios.create({ 
          baseURL:  process.env.VUE_APP_URL,
          auth: {
            username: process.env.VUE_APP_BASIC_USER ,
            password: process.env.VUE_APP_BASIC_PASS
          }, 
          headers: {
            Authorization: "Bearer: "+this.$store.getters.twLinkedAuthKey
          }
        })            
      }
    },


 
  }


