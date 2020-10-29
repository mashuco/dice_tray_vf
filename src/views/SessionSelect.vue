<template>
  <v-app >
    <SessionSelectPage 
      v-on:clickSubmit="doSelectSession" 
      v-on:pageBack="logout" 
      :sessionData = "sessionAllData"
    />
  </v-app>
</template>
<script>
  import Vue from "vue"
  import SessionSelectPage from '../components/SessionSelectPage'
   
  export default {
    mixins: [
    ],
    components: {
      SessionSelectPage
    },
    data() {
      return {
        sessionAllData:[],
      }
    },
    created() {
    },
    mounted() {
      if(this.$store.getters.login!=true){
         this.$emit('routing')
         return
      }
      this.loadAllSession()
    },
    computed: {
    },
    destoryed: function () {
    },
    methods: {
      async loadAllSession(){
          await this.$axios.get('/session/?format=json'
          ).then(response => {
            this.sessionAllData = response.data
          }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
      },
      async doSelectSession(str){
        this.choiceSession = true
        this.$store.commit('notifyTrpgSessionId',str)
        this.$store.commit('notifyChoiceSession',true)
        this.$emit('routing')
      },

      logout(){
        this.$emit('logout')
      }

   }      
  }
</script>
<style>
  @import "../css/styles.css"
</style>