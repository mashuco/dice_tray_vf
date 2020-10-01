import Vue from "vue"
import axios from 'axios'

export default  {
    created:function() {
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
    async loadSelectedSessionInfo(str){
      await this.$axios.get('/uEntry/?format=json&trpg_session='+str,
      ).then(response => {
            this.sessionAllTicketData             = response.data
        }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true});
    },
    async loadAllSession(){
        await this.$axios.get('/session/?format=json'
        ).then(response => {
          this.sessionAllData = response.data
        }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true});
console.log(this.sessionAllData)
console.log("this.sessionAllData")
    },
    async chatLoad(){
      await this.$axios.get('/uDiceLog/?format=json&session_users__trpg_session='+this.$store.getters.trpgSessionId).then(response => {
        this.chatMessages = response.data
      })
      this.scrollToLastItem()
    },

 
  }


