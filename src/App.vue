
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
              class="side-bar-header"
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
                  <v-col class="pa-1 ma-0">
                    <v-select  class="pa-0 ma-0"
                      v-model="selected_dice_face"
                      :items="dice_face_options"
                      item-text="name"
                      item-value="id"
                      outlined
                      return-object
                      dense
                      style="width:95px;"
                    ></v-select>
                  </v-col>
                  <v-col class="pa-2 ma-0">
                    <el-input-number style="width:110px;"  size="small" v-model="dice_num"  :min="1" :max="100"></el-input-number>
                  </v-col>
                  <v-col class="py-3  ma-0">
                    <v-btn  outlined small @click="onSelectRollDice">個振る</v-btn>
                  </v-col>
                </v-row>
                <v-row class="pa-0 ma-0">
                  <v-col class="pa-0 ma-0">
                    <v-switch v-model="use_dice_target"  label="目標"></v-switch>
                  </v-col>
                  <v-col class="pa-3 ma-0">
                    <el-input-number style="width:110px;" :disabled="!use_dice_target" size="small" v-model="dice_target"  :min="1" :max="100"></el-input-number>
                  </v-col >
                  <v-col class="py-5 ma-0">
                    以上
                  </v-col >
                </v-row>
                <v-row>
                  <v-col class="pa-0 ma-0">
                  <v-text-field class="pa-0  ma-0"
                    v-model="textarea_dice_command"
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
                  ></v-textarea>
                </v-list-item-content>
              </v-list-item>
            </v-list> 
          </v-sheet>
          </v-layout>
      </v-container>
    </v-navigation-drawer>
    <v-main
    :style="{backgroundImage:`url('${bgImg}')`}" class="bg-img"
    >
      <v-container class="S">
        <v-row >
        <v-col >
          <router-view ></router-view>
        </v-col>
        </v-row>
      </v-container>
    </v-main>
    </div>
  </v-app>
  <v-app v-else-if="login">
      <v-container>
        <h2 class = "input_title">チケット番号を入力</h2>
        <div>(テストユーザー⇒123)</div>      
        <v-text-field
            v-model="textarea_ticekt_no"
            label="チケットNO"
            @keydown.enter="onEntry"
        ></v-text-field>
        <v-btn  v-on:click="onEntry" >Entry</v-btn>
      </v-container>
    </v-app>
  <v-app v-else>
    <v-container fluid class="pa-0">
      <v-row align="center">
        <v-col cols="12" >
          <v-btn block x-large color="#009688"  @click="doLogin" >Twitterでログイン</v-btn>
        </v-col>
      </v-row>
    </v-container>
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
  axios.defaults.baseURL = process.env.VUE_APP_URL

  export default {
    data() {
      return {
        drawer: true,
        messages:[],
        sessionData:[],
        login:false,
        entry:false,
        textarea_ticekt_no:'',
        textarea_dice_command:'',
        dice_num:1,
        dice_face_options: [
                    { id: '4', name: '4面' },
                    { id: '6', name: '6面' },
                    { id: '8', name: '8面' },
                    { id: '10', name: '10面' },
                    { id: '12', name: '12面' },
                    { id: '20', name: '20面' },
                    { id: '100', name: '100面' },
        ],
        selected_dice_face: {id:'6',name:'6面'},
        dice_target:'',
        bgImg:'',
        audio: new Audio(),
        isPlay: false,
        duration: 0,
        currentTime: 0,
        use_dice_target:false,
        panale1Visible:false,
        navDrawerContent :null,
        window_width: window.innerWidth,
        window_height: window.innerHeight,
        diceImgPath: require('@/assets/142187.png')
      };
    },
    created() {
      this.$vuetify.theme.dark = true
      this.fireBaseAuthState()
    },
    mounted() {
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
              return this.window_width+"px"
          },
          window_height_prop(){
              return this.window_height+"px"
          },
      },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    test(){
      this.navDrawerContent = this.$refs.myNavDrawer
      //console.log(this.$el)
      //console.log(this.$refs)
      console.log(this.navDrawerContent)

    },
    handleResize: function() {
      if(this.drawer==true)
        return
      this.window_width = window.innerWidth;
      this.window_height = window.innerHeight;
    },
    fireBaseAuthState(){
      if(!Vue.config.debug){
        var firebaseConfig = {
            apiKey: "AIzaSyBCtkiqT0oEBhTUf0myLAda9TFnAInET1o",
            authDomain: "dice-adab6.firebaseapp.com",
            databaseURL: "https://dice-adab6.firebaseio.com",
            projectId: "dice-adab6",
            storageBucket: "dice-adab6.appspot.com",
            messagingSenderId: "178770782401",
            appId: "1:178770782401:web:7f6bfe1ec009964df20c40"
          };
          firebase.initializeApp(firebaseConfig);  
          firebase.auth().onAuthStateChanged(user => {
            var twitter_user = user ?user : {}
            const ref_message = firebase.database().ref('message')
            if (user) {
              //ref_message.limitToLast(10).on('child_added', this.firebaseMessageAdded)
              ref_message.limitToLast(10).on('child_changed',this.firebaseMessageChanged2)
            } else {
              ref_message.limitToLast(10).on('child_changed',this.firebaseMessageChanged2)
              this.$router.push("/")
              //ref_message.limitToLast(10).on('child_added', this.firebaseMessageAdded)
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
      if(Vue.config.debug){
        this.login = true,alert('AUTO LOGIN')
        return  
      }
      if(this.$store.getters.twUID=='')
        return

      const provider = new firebase.auth.TwitterAuthProvider()
      await firebase.auth().signInWithPopup(provider)
      this.login = true

    },
    doLogout() {
      this.login = false,this.entry= false
      if(Vue.config.debug)
          return
      firebase.auth().signOut()
    },
    onEntry: function(evnet){
      if(this.textarea_ticekt_no===""){
        alert('チケット番号を入力してください')
        return
      }else{
        this.chekTicekt()
      }
    },
    async chekTicekt(){
      await axios.get('/uEntry/?format=json&ticket_no='+this.textarea_ticekt_no,
      ).then(response => {
            this.entyrInfo = response.data
      })
      if(typeof this.entyrInfo[0] === 'undefined'){
          alert('存在しないチケットです')
          return
      }
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
        this.$store.commit('notifyNowScene',this.sessionData[0]['trpg_session_now_scene'])
        this.$store.commit('notifyFirebaseMessageKeyId',this.sessionData[0]['firebase_message_key_id'])
        this.$store.commit('notifyFirebaseSceanKeyId',this.sessionData[0]['firebase_scean_key_id'])

        this.$router.push({ name: "story" })
        this.loadChatlog();
        if(Vue.config.debug)
          return

        this.updateTwuserInfo(
          this.$store.getters.twUID,
          this.$store.getters.twName,
          this.$store.getters.twPhoto
        )
      },
      async updateTwuserInfo(twUID,twName,twPhoto){
        var csrftoken = Cookies.get('csrftoken')
        await axios.patch(
          '/userTwUp/'+this.$store.getters.sessionUserId+'/', 
          { 
            tw_UID :twUID,
            tw_name:twName,
            tw_photo:twPhoto
          },
          {
            headers: {
              'X-CSRFToken': csrftoken,
            },
          }
        ).then(response => {
          this.postResuolt = response.data
        })
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
            roll_dice_command:this.textarea_dice_command,
            twitter_users_name: this.$store.getters.twName,
            twitter_users_photo:this.$store.getters.twPhoto
          },
          {headers: {'X-CSRFToken': csrftoken,},}
        ).then(response => {
          this.postResuolt = response.data
          this.loadChatlog()  
        })
        this.doChatFireBaseUpdate()
        this.textarea_dice_command =""
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
        if(this.textarea_dice_command===""){
          alert('コマンドを入力してください')
          return
        }
        this.rollDice() 
      },
      onSelectRollDice:function(event){
        if(this.dice_target==null || this.use_dice_target==false){
          this.textarea_dice_command = this.dice_num+"d"+this.selected_dice_face.id
        }else{
          this.textarea_dice_command = this.dice_num+"d"+this.selected_dice_face.id+">="+this.dice_target
        }
        this.rollDice() 
      },
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
      firebaseMessageChanged2(snap) {
        console.log("firebaseMessageChanged")

        if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
          return
        if(snap.val().sessionUserId==this.$store.getters.sessionUserId) 
          return
          console.log("caht!!")
//        this.loadChatlog()
      },
      doChatFireBaseUpdate() {
        //firebase.database().ref('message').push({
        //  message: 'chatUpdate'
        //  }, () => {
        //    this.textarea_dice_command = ""
        //})
        firebase.database().ref('message').child(this.$store.getters.firebaseMessageKeyId).update(
          {
            sessionUserId:this.$store.getters.sessionUserId,
            trpgSessionId:this.$store.getters.trpgSessionId
            }
        );
      },
    }      
  }
</script>

<style>
  @import "./css/styles.css";
</style>