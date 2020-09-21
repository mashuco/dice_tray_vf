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
          <span class="title">Xamaru</span>
        </v-toolbar-title>
        <v-toolbar-items>
          <v-menu class ="menu">
            <template v-slot:activator="{on}">
              <v-btn v-on="on" text>Menu</v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-content/>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title  @click="doStory">Story</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title  @click="doMemberProfile">Party</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title  @click="doMyProfile">my_profile</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title  @click="doLogout">Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
           <v-menu class ="menu">
            <template v-slot:activator="{on}">
              <v-btn v-on="on" text >
                 <v-icon class="pa-0 ma-0" >volume_mute</v-icon>                
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-content/>
              </v-list-item>
              <v-list-item>
                <v-slider
                  v-model="audioVolume"
                  min=0
                  max=100
                  vertical 
                  @end ="audioVolumeChenge"
                  @click:prepend = "audioPlayAndPause"
                  :prepend-icon="audioIcon"
                ></v-slider>
                {{audioVolume}}
              </v-list-item>
            </v-list>
           </v-menu>
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
            <v-card   
              class="side-bar-header "
              :width = 'window_width_prop '
             >
                <div style="width:1px; height: 5px"/>
                  <v-row class="pa-0 ma-0" justify="start">
                    <v-col class="pa-0 ma-0">
                       <v-img
                        :src="diceImgPath"
                        max-height="35" 
                        contain
                        class="pa-0 ma-0"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="pa-0 ma-0">
                  <v-col class="pa-0 ma-0">
                    <v-select  class="pa-0 ma-0"
                      v-model="diceSelectedFace"
                      :items="diceFaceOptions"
                      item-text="name"
                      item-value="id"
                      outlined
                      return-object
                      dense
                      style="width:90px;"
                    ></v-select>
                  </v-col>
                  <v-col class="pa-2 ma-0">
                    <el-input-number 
                      style="width:110px;  font-size: 16px; transform: scale(0.8);"
                      size="small"
                      v-model="diceNum"  
                      :min="1" 
                      :max="100"
                    ></el-input-number>
                  </v-col>
                  <v-col class="py-3  ma-0">
                    <v-btn  outlined small @click="chatOnSelectRollDice">個振る</v-btn>
                  </v-col>
                </v-row>
                <v-row class="pa-0 ma-0">
                  <v-col class="pa-0 ma-0">
                    <v-switch v-model="diceUseTarget"  label="目標"></v-switch>
                  </v-col>
                  <v-col class="pa-3 ma-0">
                    <el-input-number 
                      style="width:130px;  font-size: 16px; transform: scale(0.8);"
                      size="small"
                      :disabled="!diceUseTarget" 
                      v-model="diceTarget"  
                      :min="1" 
                      :max="100"
                      ></el-input-number>
                  </v-col >
                  <v-col class="py-5 ma-0">
                    以上
                  </v-col >
                </v-row>
                <v-row>
                  <v-col class="pa-0 ma-0">
                  <v-text-field class="pa-0  ma-0"
                    v-model="chatTextarea"
                    placeholder="input message..."
                    single-line
                    append-icon="mdi-chat"
                    color="white"
                    hide-details
                    @keydown.enter="chatOnDiceRoll"
                    ></v-text-field>
                  </v-col>
                </v-row>
          </v-card >
          <v-sheet class="chat-window"
            :width = 'window_width_prop'
          >
            <v-list three-line >
              <v-list-item v-for="item in chatMessages
              " :key="item.text" link >
                <img class="character_image_s" :src="item.character_image"/>
                <v-list-item-content>
                  <v-textarea
                    outlined
                    :value="chatMessage(item.roll_dice_command,item.roll_dice_result_sum,item.roll_dice_result_split,item.is_roll_daice_suees)"
                    :label="item.character_name +'('+ item.twitter_users_name +')'"
                    style="white-space:pre"
                    height="70px"
                    readonly
                  ></v-textarea>
                </v-list-item-content>
              </v-list-item>
            </v-list> 
          </v-sheet>
        </v-layout>>
      </v-container>
    </v-navigation-drawer>
    <v-main  :style="{backgroundImage:`url('${bgImg}')`}" class="bg-img" >
      <v-container >
        <v-dialog v-model="dialog" max-width= "500">
          <Dialog
            v-on:clickSubmit="dialogClose"
            title="確認"
            :msgArr="dialogMsgArr"
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
  <v-app v-else-if="ChoiceSession">
   <TicketSelectPage
      v-on:select="selectTicket" 
      :ticketData = "sessionAllTicketData"
      :ticketDataWithoutGM ="sessionTicketDataWithOutGMMaster"
    />
  </v-app>
  <v-app v-else-if="login">
    <SessionSelectPage 
      v-on:clickSubmit="onSelectSession" 
      :sessionData = "sessionAllData"
    />
  </v-app>
  <v-app v-else>
    <LoginPage 
      v-on:clickSubmit="doLogin" 
      :authloading ="TwAuthloading"
    />
  </v-app>
</template>
<script>
  import Vue from "vue"
  import firebase from 'firebase/app'
  import "firebase/auth"
  import "firebase/database"
  import Cookies from 'js-cookie'
  import Story from './views/Story.vue'
  import Vuetify from 'vuetify/lib'
  import './plugins/element.js'
  import Dialog from './components/Dialog'
  import LoginPage from './components/App/LoginPage'
  import SessionSelectPage from './components/App/SessionSelectPage'
  import TicketSelectPage  from './components/App/TicketSelectPage'
  import regTwitterInfo from './services/App/regTwitterInfo'
  import audioMixin from './mixins/App/audioMixin.js'
  import chatMixin from './mixins/App/chatMixin.js'
  import diceMixin from './mixins/App/diceMixin.js'
  import firebaseMixin from './mixins/App/firebaseMixin.js'
 
 export default {
    mixins: [audioMixin,chatMixin,diceMixin,firebaseMixin],
    components: {
      LoginPage,
      SessionSelectPage,
      TicketSelectPage,
      Dialog,
    },
    data() {
      return {
        drawer: true,
        sessionData:[],
        sessionAllData:[],
        sessionAllTicketData:[],
        sessionTicketDataWithOutGMMaster:[],
        sceneAllData:[],
        login:false,
        ChoiceSession:false,
        entry:false,
        bgImg:'',
        navDrawerContent :null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        TwAuthloading:false,
        dialog:false,
        dialogMsgArr:[]
      };
    },
    created() {
      this.$vuetify.theme.dark = true
      this.loadAllSession()
      this.fireBaseAuthState()
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
      checkLoginTwId(){
      },
      handleResize: function() {
        if(this.drawer==true)
          return
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
      },
      testfirebaseTicketMessageChanged(snap) {
      }, 
      async doLogin() {
        this.login = true
      },
      doLogout() {
        regTwitterInfo(this.$axios,'','','', this.$store.getters.sessionUserId)
        this.forcedLogout()
      },
      forcedLogout(){
        this.ticketFireBaseStateUpdateTicektRelease()
        this.entry = false
        this.login = false
        this.ChoiceSession=false
        this.ticket_no=''
        this.audio.pause()
      },
      onSelectSession(str){
      　this.ticketFireBaseStateWatch()
        this.$store.commit('notifyTrpgSessionId',str)
        this.loadSession(str)
        this.ChoiceSession = true
      },
      async loadSession(str){
        await this.$axios.get('/uEntry/?format=json&trpg_session='+str,
        ).then(response => {
              this.sessionAllTicketData             = response.data
              this.sessionTicketDataWithOutGMMaster = response.data.filter(function(item,index){
                if(item.is_session_master == false)
                  return true
              })
        }).catch(error => {
          this.dialogMsgArr.push("通信エラー")
          this.dialog = true
        });
      },
      async loadAllSession(){
          await this.$axios.get('/session/?format=json'
          ).then(response => {
            this.sessionAllData = response.data
          }).catch(error => {
            this.dialogMsgArr.push("通信エラー")
            this.dialog = true
            });
      },
      async selectTicket(searchTicket){
        this.entyrInfo = searchTicket
        this.$store.commit('notifyTrpgSessionId',this.entyrInfo[0]['trpg_session'])
        this.$store.commit('notifyTrpgSessionName',this.entyrInfo[0]['trpg_session_name'])
        this.$store.commit('notifyUserName',this.entyrInfo[0]['name'])
        this.$store.commit('notifyIsSessionMaster',this.entyrInfo[0]['is_session_master'])
        this.$store.commit('notifySessionUserId',this.entyrInfo[0]['session_user_id'])
        this.entry = true

        await this.$axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId
        ).then(response => {
          this.sessionData = response.data
        }).catch(error => {
          this.dialogMsgArr.push("通信エラー")
          this.dialog = true
        });
        this.$store.commit('notifyFirebaseMessageKeyId',this.sessionData[0]['firebase_message_key_id'])
        this.$store.commit('notifyFirebaseSceanKeyId',this.sessionData[0]['firebase_scean_key_id'])
        this.$store.commit('notifyTicketId',this.entyrInfo[0]['ticket_no'])

        await this.ticketFireBaseStateUpdate()

        if(this.$route.path!="/story")
          this.$router.push({ name: "story" })

        await this.$axios.get('/scene/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
            this.sceneAllData = response.data
        })

        this.chatLoad()

        regTwitterInfo(
          this.$axios,
          this.$store.getters.twUID,
          this.$store.getters.twName,
          this.$store.getters.twPhoto,
          this.$store.getters.sessionUserId
        )

    },
    doStory(){
      if(this.is_mdAndUp == false)
      this.drawer = false
      this.$router.push({ name: "story" , props:{p_entry : this.entry}})
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
  @import "./css/styles.css";
</style>