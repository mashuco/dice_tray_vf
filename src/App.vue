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
          <v-spacer></v-spacer>
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
                    <v-list-item-title  @click="switchMusic"  v-if="isPlay == true" >BGM停止</v-list-item-title>
                    <v-list-item-title  @click="switchMusic"  v-else >BGM再生</v-list-item-title>
                 </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title  @click="doLogout">Logout</v-list-item-title>
                </v-list-item-content>
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
                      v-model="selectedDiceFace"
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
                    <v-btn  outlined small @click="onSelectRollDice">個振る</v-btn>
                  </v-col>
                </v-row>
                <v-row class="pa-0 ma-0">
                  <v-col class="pa-0 ma-0">
                    <v-switch v-model="useDiceTarget"  label="目標"></v-switch>
                  </v-col>
                  <v-col class="pa-3 ma-0">
                    <el-input-number 
                      style="width:130px;  font-size: 16px; transform: scale(0.8);"
                      size="small"
                      :disabled="!useDiceTarget" 
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
                    v-model="textareaDiceCommand"
                    placeholder="input message..."
                    single-line
                    append-icon="mdi-chat"
                    color="white"
                    hide-details
                    @keydown.enter="onRoll"
                    ></v-text-field>
                  </v-col>
                </v-row>
          </v-card >
          <v-sheet class="chat-window"
            :width = 'window_width_prop'
          >
            <v-list three-line >
              <v-list-item v-for="item in messages" :key="item.text" link >
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
      <v-container class="S">
        <v-row >
        <v-col >
          <router-view ></router-view>
        </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
  <v-app v-else-if="ChoiceSession">
   <TicektSelectPage
      v-on:clickSubmit="chekTicekt" 
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
  import axios from 'axios'
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
  import TicektSelectPage  from './components/App/TicektSelectPage'
  import regTwitterInfo from './services/App/regTwitterInfo'
  axios.defaults.baseURL = process.env.VUE_APP_URL

  export default {
    components: {
      LoginPage,
      SessionSelectPage,
      TicektSelectPage,
      Dialog,
    },
    data() {
      return {
      name: '',
      email: '',
      dialog: false,
      dialogmsg:'',
        drawer: true,
        messages:[],
        sessionData:[],
        sessionAllData:[],
        sessionAllTicketData:[],
        sessionTicketDataWithOutGMMaster:[],
        login:false,
        ChoiceSession:false,
        entry:false,
        textareaDiceCommand:'',
        diceNum:1,
        diceFaceOptions: [
          { id: '4', name: '4面' },
          { id: '6', name: '6面' },
          { id: '8', name: '8面' },
          { id: '10', name: '10面' },
          { id: '12', name: '12面' },
          { id: '20', name: '20面' },
          { id: '100', name: '100面' },
        ],
        selectedDiceFace: {id:'6',name:'6面'},
        diceTarget:'',
        bgImg:'',
        audio:null,
        isPlay: false,
        duration: 0,
        currentTime: 0,
        useDiceTarget:false,
        panale1Visible:false,
        navDrawerContent :null,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        diceImgPath: require('@/assets/142187.png'),
        TwAuthloading:false,
        bgmVolume:0.5
      };
    },
    created() {
      this.$vuetify.theme.dark = true
      this.loadAllSession()
      this.fireBaseAuthState()
      if(this.audio != null)
        delete  this.Audio
      this.audio= new Audio()
      this.audio.loop =true
    },
    mounted() {
      //document.querySelector("meta[name='viewport']").setAttribute('content', "user-scalable=0")
      window.addEventListener('resize', this.handleResize)
      this.$store.watch(
          (state, getters) => getters.trpgSessionImg,
          (newValue, oldValue) => {
            this.bgImg = this.$store.getters.trpgSessionImg
          }
        ),
        this.$store.watch(
          (state, getters) => getters.trpgSessionBgm,
          (newValue, oldValue) => {
            if(this.entry != true)
              return

            if(this.$store.getters.trpgSessionBgm == null){
              this.audio.pause()
              return
            }
            this.audio.src = this.$store.getters.trpgSessionBgm
            this.audio.load(),this.audio.play(),this.isPlay=true
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
    dice_tray_wide(){
      if(this.$vuetify.breakpoint.mdAndUp)
        return '100%'
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
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    test(params){
    },
    onSubmit(params) {
      this.dialog =false
      this.name = params.name
      this.email = params.email
    },
    handleResize: function() {
      if(this.drawer==true)
        return
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      viewportContent = "width=device-width,initial-scale=1.0" 
      document.querySelector("meta[name='viewport']").setAttribute("content", viewportContent) 
    },
    fireBaseAuthState(){
      if(!Vue.config.debug){
        var firebaseConfig = {
          apiKey:process.env.VUE_APP_FIREBASE_CONFIG_APIKEY ,
          authDomain:process.env.VUE_APP_FIREBASE_CONFIG_AUTHDOMAIN ,
          databaseURL:process.env.VUE_APP_FIREBASE_CONFIG_DATABASEURL ,
          projectId:process.env.VUE_APP_FIREBASE_CONFIG_PROJECTID ,
          storageBucket:process.env.VUE_APP_FIREBASE_CONFIG_STORAGEBUCKET ,
          messagingSenderId:process.env.VUE_APP_FIREBASE_CONFIG_MESSAGINGSENDERID ,
          appId:process.env.VUE_APP_FIREBASE_CONFIG_APPID
         }
        firebase.initializeApp(firebaseConfig);  
        firebase.auth().onAuthStateChanged(user => {
          var twitter_user = user ?user : {}
          const ref_message = firebase.database().ref('message')
          if (user) {
            ref_message.limitToLast(10).on('child_changed',this.firebaseMessageChanged)
          } else {
            ref_message.limitToLast(10).on('child_changed',this.firebaseMessageChanged)
            //this.$router.push("/")
          }
          this.$store.commit('notifyTwUID',twitter_user.uid)
          this.$store.commit('notifyTwName',twitter_user.displayName)
          this.$store.commit('notifyTwPhoto',twitter_user.photoURL)
        })
      }else{
          this.$store.commit('notifyTwUID','test')
          this.$store.commit('notifyTwName','test')
          this.$store.commit('notifyTwPhoto','')
      }
    },
    async doLogin() {
/*
      this.TwAuthloading = true
      if(Vue.config.debug){
        this.login = true,alert('AUTO LOGIN')
        this.TwAuthloading =false
        return  
      }
      const provider = new firebase.auth.TwitterAuthProvider()
      await firebase.auth().signInWithPopup(provider)
      this.TwAuthloading = false
*/
      this.login = true
    },
    doLogout() {
      this.login = false
      this.entry= false
      this.ChoiceSession=false
      this.ticket_no=''
      this.audio.pause()
      regTwitterInfo('','','', this.$store.getters.sessionUserId)

      if(Vue.config.debug)
          return
      firebase.auth().signOut()
    },
    async onSelectSession(str){
      this.$store.commit('notifyNowSessionId',str)
      this.ChoiceSession = true
      //await axios.get('/uEntry/?format=json&is_session_master=false&trpg_session='+str,
      await axios.get('/uEntry/?format=json&trpg_session='+str,
      ).then(response => {
            this.sessionAllTicketData             = response.data
            this.sessionTicketDataWithOutGMMaster = response.data.filter(function(item,index){
              if(item.is_session_master == false)return true
            })
     })
    },
    async loadAllSession(){
        await axios.get('/session/?format=json'
        ).then(response => {
          this.sessionAllData = response.data
        })
    },
    async chekTicekt(searchTicket){
      this.entyrInfo = searchTicket
      this.audio.play()
      this.isPlay = true
      this.$store.commit('notifyTickesNo',this.entyrInfo[0]['ticket_no'])
      this.$store.commit('notifyTrpgSessionId',this.entyrInfo[0]['trpg_session'])
      this.$store.commit('notifyTrpgSessionName',this.entyrInfo[0]['trpg_session_name'])
      this.$store.commit('notifyUserName',this.entyrInfo[0]['name'])
      this.$store.commit('notifyIsSessionMaster',this.entyrInfo[0]['is_session_master'])
      this.$store.commit('notifySessionUserId',this.entyrInfo[0]['session_user_id'])
      this.entry = true
      await axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId
      ).then(response => {
        this.sessionData = response.data
      })
      this.$store.commit('notifyFirebaseMessageKeyId',this.sessionData[0]['firebase_message_key_id'])
      this.$store.commit('notifyFirebaseSceanKeyId',this.sessionData[0]['firebase_scean_key_id'])

      if(this.$route.path!="/story")
        this.$router.push({ name: "story" })

      this.loadChatlog();
     
      regTwitterInfo(
        this.$store.getters.twUID,
        this.$store.getters.twName,
        this.$store.getters.twPhoto,
        this.$store.getters.sessionUserId
      )
   },
      loadMusic: function(){
        this.audio.src =this.$store.getters.trpgSessionBgm
        this.audio.load(),this.audio.play(),this.isPlay = true
        this.audio.addEventListener('canplay', () => {
          this.duration = this.audio.duration;
        });
        this.audio.addEventListener('timeupdate', () => {
          this.currentTime = this.audio.currentTime;
        });
        this.audio.addEventListener('ended', ()=> {
          this.audio.currentTime = 0
          this.audio.play()
        });
      },
      switchMusic: function () {
         this.isPlay = !this.isPlay
         if(this.isPlay==true){
           this.audio.play()
         }else{
           this.audio.pause()
         }
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
      async rollDice(){
        var csrftoken = Cookies.get('csrftoken')
        await axios.post('/uDiceRoll/', 
          { 
            session_users:this.$store.getters.sessionUserId, 
            roll_dice_command:this.textareaDiceCommand,
            twitter_users_name: this.$store.getters.twName,
            twitter_users_photo:this.$store.getters.twPhoto
          },
          {headers: {'X-CSRFToken': csrftoken,},}
        ).then(response => {
          this.postResuolt = response.data
          this.loadChatlog()  
        })
        this.doChatFireBaseUpdate()
        this.textareaDiceCommand =""
      },
      async loadChatlog(){
          await axios.get('/uDiceLog/?format=json&session_users__trpg_session='+this.$store.getters.trpgSessionId).then(response => {
            this.messages = response.data
          })
          await this.scrollToLastItem()
      },
      scrollToLastItem() {
          this.navDrawerContent = this.$refs['myNavDrawer'].$el.querySelector('div.v-navigation-drawer__content');
          this.$vuetify.goTo(99999 ,{ container:this.navDrawerContent})
      },
      chatMessage(msg,rollSum,rollResult,SuccessOrFailure) {
        if(rollSum == "") 
          return msg
        if(SuccessOrFailure == null)
          return msg +"\n"+ rollResult+">>"+rollSum
        
        return msg +"\n"+ rollResult+">>"+rollSum+">>"+ (SuccessOrFailure?"成功":"失敗")
      },
      async setTwuserInfo(){
        var csrftoken = Cookies.get('csrftoken')
        await axios.patch(
          '/userTwUp/'+this.$store.getters.sessionUserId+'/', 
          { 
            tw_UID :this.$store.getters.twUID,
            tw_name:this.$store.getters.twName,
            tw_photo:this.$store.getters.twPhoto
          },
          {headers: {'X-CSRFToken': csrftoken,},}
        ).then(response => {
          this.postResuolt = response.data
        })
      },
      onRoll:function(event){
        if(this.textareaDiceCommand===""){
          alert('コマンドを入力してください')
          return
        }
        this.rollDice() 
      },
      onSelectRollDice:function(event){
        if(this.diceTarget==null || this.useDiceTarget==false){
          this.textareaDiceCommand = this.diceNum+"d"+this.selectedDiceFace.id
        }else{
          this.textareaDiceCommand = this.diceNum+"d"+this.selectedDiceFace.id+">="+this.diceTarget
        }
        this.rollDice() 
      },
      /*
      firebaseMessageAdded(snap) {
        if (this.entry!=true)
          return
        var fBmessage = snap.val().message.split('|')
        switch(fBmessage[0]){
          case 'chatUpdate':
           this.loadChatlog()
           break
          default:
           break
        }
      },
      */
      firebaseMessageChanged(snap) {
        if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
          return
        if(snap.val().sessionUserId==this.$store.getters.sessionUserId) 
          return
        this.loadChatlog()
      },
      doChatFireBaseUpdate() {
        var date = new Date()
        firebase.database().ref('message').child(this.$store.getters.firebaseMessageKeyId).update(
          {
            sessionUserId:this.$store.getters.sessionUserId,
            trpgSessionId:this.$store.getters.trpgSessionId,
            updateDate:date.getTime()
            }
        );
      },
    }      
  }
</script>
<style>
  @import "./css/styles.css";
</style>