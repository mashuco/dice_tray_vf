<template>
  <v-app prop v-if="entry">
    <div class="app-bar">
      <v-app-bar
        app
        clipped-left
        color="red"
        dense
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-icon class="mx-4" large>mdi-biohazard</v-icon>
        <v-toolbar-title class="mr-12 align-center">
          <span class="title">Xamaru(β)</span>
        </v-toolbar-title>
        <v-toolbar-items>
          <Menu class ="menu"
            v-on:doScene="doScene" 
            v-on:doMemberProfile="doMemberProfile" 
            v-on:doMyProfile="doMyProfile" 
            v-on:doLogout="doLogout" 
          />
          <SoundVolume class ="menu"
            :parentVolume = 'audioVolume'
            :isPlay = 'isPlay'
            v-on:audioVolumeChenge = "audioVolumeChenge2"
            v-on:audioPlayAndPause = "audioPlayAndPause"
          />
        </v-toolbar-items>
      </v-app-bar>
    </div>
    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        stateless
        :width = 'navigation_wide'
        ref="myNavDrawer"
    >
        <v-container class="pa-0 ma-1">
          <v-layout wrap>
            <ChatCommand  class="pa-0 ma-0 side-bar-header "
              v-on:sendCommand="sendCommand" 
              :window_width_prop ="window_width_prop"
            />
            <ChatList class="pa-0 ma-0 chat-window"
              :chatMessages = chatMessages
              :window_width_prop ="window_width_prop"
            />
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <v-main  :style="{backgroundImage:`url('${bgImg}')`}" class="bg-img" >
      <v-container >
        <v-dialog v-model="dialog" max-width= "500">
          <Dialog
            v-on:clickSubmit="dialogClose"
            title="確認"
            :msgArr="dialogMsgArr"
            :notification = 'true'
          ></Dialog>
        </v-dialog>
        <v-dialog v-model="dialogLogout" max-width= "500">
          <Dialog
            v-on:clickSubmit="forcedLogout"
            title="確認"
            :msgArr="dialogMsgArr"
          ></Dialog>
        </v-dialog>
        <v-row >
        <v-col >
          <router-view ></router-view>
        </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
  <v-app v-else-if="choiceSession">
   <TicketSelectPage
      v-on:select="doSelectTicket" 
      v-on:releaseSession="releaseSession"
      :ticketData = "sessionAllTicketData"
      :loginUsers = "loginUsers"
    />
  </v-app>
  <v-app v-else-if="login">
    <SessionSelectPage 
      v-on:clickSubmit="doSelectSession" 
      v-on:pageBack="forcedLogout" 
      :sessionData = "sessionAllData"
    />
  </v-app>
  <v-app v-else>
    <LoginPage
      v-on:clickSubmit="doLogin" 
      :authloading ="twAuthloading"
    />
  </v-app>
</template>
<script>
  import Vue from "vue"
  import Menu from './components/Menu'
  import LoginPage from './components/LoginPage'
  import SessionSelectPage from './components/SessionSelectPage'
  import TicketSelectPage  from './components/TicketSelectPage'
  import ChatCommand from './components/ChatCommand'
  import ChatList from './components/ChatList'
  import SoundVolume from './components/SoundVolume'
  import Dialog from './components/Dialog'

  import firebase from 'firebase/app'
  import "firebase/auth"
  import "firebase/database"
  import Cookies from 'js-cookie'
  import Scene from './views/Scene.vue'
  import Vuetify from 'vuetify/lib'
  import './plugins/element.js'
  import fireBaseService from './services/fireBaseService'
  import twitterInfoService from './services/twitterInfoService'
  
  import fireBaseUtils from './utils/fireBaseUtils'
  import axsiosUtils from './utils/axsiosUtils'
  import mediaUtils from './utils/mediaUtils'
  import audioMixin from './mixins/App/audioMixin.js'
  import chatMixin from './mixins/App/chatMixin.js'
  import ticketMixin from './mixins/App/ticketMixin.js'
  import firebaseMixin from './mixins/App/firebaseMixin.js'
  import loginMixin from './mixins/App/loginMixin.js'
  
 
 export default {
    mixins: [
      ticketMixin,
      audioMixin,
      chatMixin,
      firebaseMixin,
      loginMixin
    ],
    components: {
      LoginPage,
      SessionSelectPage,
      TicketSelectPage,
      Menu,
      SoundVolume,
      ChatCommand,
      ChatList,
      Dialog,
    },
    data() {
      return {
        login:false,
        choiceSession:false,
        entry:false,

        sessionData:[],
        sessionAllData:[],
        sessionAllTicketData:[],
        sceneAllData:[],

        bgImg:'',
        drawer: true,
        navDrawerContent :null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        twAuthloading:false,
        dialog:false,
        dialogMsgArr:[],
        dialogNotification:false
      }
    },
    created() {
      this.$vuetify.theme.dark = true
      axsiosUtils.axsiosInitial() 
      if(Vue.config.debug ||this.$store.getters.nonLogin)
      {
        this.$store.commit('notifyTwUID','test')
        this.$store.commit('notifyTwName','test')
        this.$store.commit('notifyTwPhoto',this.diceImgPath)
        return
      }              
      fireBaseUtils.fireBaseAuth()
    },
    mounted() {
      window.addEventListener('resize', this.handleResize)
      this.$store.watch(
        (state, getters) => getters.trpgSessionImg,
        (newValue, oldValue) => {
          this.bgImg = this.$store.getters.trpgSessionImg
        }
      )
    },
    computed: {
      navigation_wide(){
        if(this.$vuetify.breakpoint.mdAndUp)
          return '30%'
        if(this.$vuetify.breakpoint.smAndDown)
          return '100%'
      },
      is_mdAndUp(){
        return this.$vuetify.breakpoint.mdAndUp
      },
      window_width_prop(){
          return this.windowWidth+"px"
      },
      window_height_prop(){
          return this.windowHeight+"px"
      },
    },
    destoryed: function () {
      window.removeEventListener('resize', this.handleResize)
      this.doLogout()
    },
    methods: {
      media_url_prefix(){
        if(str==null)
          return ""
        return mediaUtils.urlPrefix()
      },
      mediaImgUrl(str){
        return mediaUtils.mediaImgUrl(str)
      },
      handleResize: function() {
        if(this.drawer==true)
          return
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
      },
      doLogin(state) {
         this.login = state
         axsiosUtils.axsiosInitialTw(this.$store.getters.twLinkedAuthKey)
         this.loadAllSession()
      },
      async loadAllSession(){
          await this.$axios.get('/session/?format=json'
          ).then(response => {
            this.sessionAllData = response.data
          }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
      },
      doLogout() {
        twitterInfoService.regist(this.$axios,'','','', this.$store.getters.sessionUserId)
        this.forcedLogout()
      },
      forcedLogout(){
        this.fireBaseTicketRelease()
        this.entry = false
        this.login = false
        this.choiceSession=false
        this.ticket_no=''
        this.audio.pause()
      },
      releaseSession(){
        this.choiceSession = false
      },
      async doSelectSession(str){
        this.choiceSession = true
        this.$store.commit('notifyTrpgSessionId',str)
        await this.loadSelectedSessionInfo(str)
        this.selectedUserCheck()
      　this.fireBaseTicketStartIni()
      },
      async loadSelectedSessionInfo(str){
        await this.$axios.get('/uEntry/?format=json&trpg_session='+str,
        ).then(response => {
              this.sessionAllTicketData             = response.data
          }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
      },
      async doSelectTicket(searchTicket){
        this.selectTicket(searchTicket)
      },
      doScene(){
        if(this.is_mdAndUp == false)
        this.drawer = false
        this.$router.push({ name: "scene" , props:{p_entry : this.entry}})
      },
      doMemberProfile(){
        if(this.is_mdAndUp == false)
        this.drawer = false
        this.$router.push({ name: "member_profile" })
      },
      doMyProfile(){
        if(this.is_mdAndUp == false)
        this.drawer = false
        this.$router.push({ name: "my_profile" })
      },
      dialogClose(){
        this.dialog = false
      },
   }      
  }
</script>
<style>
  @import "./css/styles.css"
</style>