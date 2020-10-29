<template>
    <router-view 
      @routing="routing" 
      @logout="logout"
    />
</template>

<script>
  import Vue from "vue"
  import Cookies from 'js-cookie'
  import Vuetify from 'vuetify/lib'
  import firebase from 'firebase/app'
  import "firebase/database"
  import axiosUtils from './utils/axiosUtils'
  import mediaUtils from './utils/mediaUtils'
  import twitterInfoService from './services/twitterInfoService'

  export default {
  data() {
      return {
        currentPath:''
      }
  },
  created(){
    this.$vuetify.theme.dark = true
    axiosUtils.axiosInitial()
    this.$store.commit('notifyEntry',false)
    this.$store.commit('notifyChoiceSession',false)
    this.$store.commit('notifyLogin',false)
    this.routing()

  },
  mounted() {
  },
  computed: {

  },
  methods: {
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
        //this.fireBaseTicketRelease()
        this.$store.commit('notifyLogin',false)
        this.$store.commit('notifyChoiceSession',false)
        this.$store.commit('notifyEntry',false)
        twitterInfoService.regist(this.$axios,'','','', this.$store.getters.sessionUserId)
        //this.ticket_no=''
        //this.audio.pause()
        this.routing()
    },

  }
  }
</script>

<style>
  @import "./css/styles.css"
</style>
