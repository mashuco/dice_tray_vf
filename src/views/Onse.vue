<template>
  <v-app >
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
            v-on:doLogout="logout" 
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
            v-on:clickSubmit="logout"
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
</template>
<script>
  import Vue from "vue"
  import Menu from '../components/Menu'
  import ChatCommand from '../components/ChatCommand'
  import ChatList from '../components/ChatList'
  import SoundVolume from '../components/SoundVolume'
  import Dialog from '../components/Dialog'

  import "firebase/auth"
  import "firebase/database"
  import Cookies from 'js-cookie'
  import Vuetify from 'vuetify/lib'

  import fireBaseUtils from '../utils/fireBaseUtils'
  import axiosUtils from '../utils/axiosUtils'

  import audioMixin from '../mixins/App/audioMixin.js'
  import chatMixin from '../mixins/App/chatMixin.js'

  export default {
     mixins: [
      audioMixin,
      chatMixin
    ],
    components: {
      Menu,
      ChatCommand,
      ChatList,
      SoundVolume,
      Dialog
    },
    data() {
      return {
        bgImg:'',
        drawer: true,
        navDrawerContent :null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,

        dialog:false,
        dialogMsgArr:[],
        dialogNotification:false,

        dialogLogout:false,
      }
    },
    created() {

    },
    mounted() {
      this.chatLoad()
      this.doScene()
      this.audioInit()
      this.bgImg = this.$store.getters.trpgSessionImg
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
    },
    methods: {
      logout(){
        this.audioStop()
        this.$emit('logout')

      },      
      dialogClose(){
        this.dialog = false
      },
      doScene(){
        if(this.$router.history.current.name=='scene')
          return
        if(this.is_mdAndUp == false)
        this.drawer = false
        this.$router.push({ name: "scene" , props:{p_entry : this.entry}})
      },
      doMemberProfile(){
        if(this.$router.history.current.name=='member_profile')
          return
        if(this.is_mdAndUp == false)
        this.drawer = false
        this.$router.push({ name: "member_profile" })
      },
      doMyProfile(){
        if(this.$router.history.current.name=='my_profile')
          return
        if(this.is_mdAndUp == false)
        this.drawer = false
        this.$router.push({ name: "my_profile" })
      },

   }      
  }
</script>
<style>
  @import "../css/styles.css"
</style>