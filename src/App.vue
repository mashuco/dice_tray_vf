<template>
    <router-view 
      @routing="routing" 
      @logout="logout"
    />
</template>

<script>
  import Vue from "vue"
  import axiosUtils from './utils/axiosUtils'
  import fireBaseUtils from './utils/fireBaseUtils'
  import twitterInfoService from './services/twitterInfoService'
  export default {
    data() {
        return {
          currentPath:''
        }
    },
    created(){
      this.init()
      this.routing()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
      init(){
        this.$store.commit('notifyEntry',false)
        this.$store.commit('notifyChoiceSession',false)
        this.$store.commit('notifyLogin',false)
        this.$vuetify.theme.dark = true
        axiosUtils.axiosInitial()
        fireBaseUtils.fireBaseAuth()
      },
      routing(){
        this.currentPath = this.$router.history.current.name
        if(this.$store.getters.entry==true&&this.currentPath!=='onse'){
          this.$router.push("/onse")
        }else if(this.$store.getters.choiceSession==true&&this.currentPath!=='ticket'){
          this.$router.push("/ticket")
        }else if(this.$store.getters.login==true&&this.currentPath!=='session'){
          this.$router.push("/session")
        }else if(this.currentPath!=='login'){
          this.$router.push("/login")
        }
      },
      logout(){
          this.$store.commit('notifyLogin',false)
          this.$store.commit('notifyChoiceSession',false)
          this.$store.commit('notifyEntry',false)
          twitterInfoService.regist(this.$axios,'','','', this.$store.getters.sessionUserId)
          this.routing()
      },
    }
  }
</script>

<style>
  @import "./css/styles.css"
</style>
