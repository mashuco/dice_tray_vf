<template>
  <v-app v-if="entry">
    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        stateless
        width = "65%"
        :style="{backgroundImage:`url('${bgImg}')`}" class="bg-img"
    >
      <v-container class="mt-12" >
        <v-row justify="center" align-content="center">
        <v-col >
          <router-view></router-view>
        </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
    <div class="app-bar">
      <v-app-bar
        app
        clipped-left
        color="red"
        dense
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-icon
            class="mx-4"
            large
        >
          mdi-biohazard
        </v-icon>
        <v-toolbar-title class="mr-12 align-center">
          <span class="title">Xamaru</span>
        </v-toolbar-title>
      </v-app-bar>
    </div>

    <v-main>
      <div class="side-bar">
        <v-container>
          <div class="side-bar-header">
            <div style="width:1px; height: 50px"></div>
            <v-row >
              <v-col>
                <v-btn  @click="doLogout">Logout</v-btn>
              </v-col><v-col>
                <v-btn txet to="/member_profile" @click="drawer = true">member_profile</v-btn>
              </v-col><v-col>
                <v-btn text to="/my_profile" @click="drawer = true">MyProfile</v-btn>
              </v-col><v-col>
                <v-btn text to="/items" @click="drawer = true">items</v-btn>
              </v-col><v-col>
                <v-btn text to="/story" @click="drawer = true">story</v-btn>
              </v-col><v-col>
                <v-btn  @click="switchMusic"  v-if="isPlay == true" >BGM停止</v-btn>
                <v-btn  @click="switchMusic"  v-else >BGM再生</v-btn>
                <!--div >{{currentTime}}/{{duration}}</div-->
              </v-col>
            </v-row>
            <v-row>
              <!--v-btn
              ref="button"
              color="primary"
              @click="$vuetify.goTo(99999)"
              >end</v-btn-->    
            </v-row>
            <v-row >
              <v-col >
                  <v-select
                    :items="dice_face_option"
                    v-model="dice_face"
                    outlined
                    return-object
                  ></v-select>
                </v-col><v-col >
                  面ダイス
                </v-col><v-col >
                  <el-input-number size="small" v-model="dice_num"  :min="1" :max="100"></el-input-number>
                </v-col><v-col >
                  個
                </v-col><v-col >
              </v-col><v-col >
                <v-switch v-model="use_dice_target"  label="目標値"></v-switch>
                <el-input-number :disabled="!use_dice_target" size="small" v-model="dice_target"  :min="1" :max="100"></el-input-number>
              </v-col><v-col >
                 <v-btn  @click="onSelectRollDice">振る</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-text-field
                v-model="textarea_dice_command"
                placeholder="input message..."
                single-line
                append-icon="mdi-chat"
                color="white"
                hide-details
                @keydown.enter="onRoll"
              ></v-text-field>
            </v-row>
          </div>
          <div class="chat-window">
            <v-row >
              <v-list three-line
                min-width="500px">
                <v-list-item v-for="item in messages" :key="item.text" link >
                  <!--v-list-item-avatar>
                  <v-img :src="item.twitter_users_photo" />
                  </v-list-item-avatar>
                  <v-list-item-title v-text="item.twitter_users_name"></v-list-item-title-->

                  <img class="character_image_s" :src="item.character_image"/>

                  <v-list-item-content>
                    <!--v-list-item-title v-html="item.character_name"></v-list-item-title-->
                    <!--v-list-item-subtitle v-html="item.roll_dice_command"></v-list-item-subtitle-->
                    <v-textarea
                        outlined
                        :value="chatMessage(item.roll_dice_command,item.roll_dice_result_sum,item.roll_dice_result_split,item.is_roll_daice_suees)"
                        :label="item.character_name"
                        style="white-space:pre"
                        height="70px"
                    ></v-textarea>
                  </v-list-item-content>
                </v-list-item>
              </v-list> 
            </v-row>
          </div>
        </v-container>
      </div>
    </v-main>
  </v-app>
  <v-app v-else-if="login">
      <v-container>
        <h2 class = "input_title">チケット番号を入力</h2>
        <div>(テストユーザー⇒123)</div>      
        <v-text-field
            v-model="textarea_ticekt_no"
            label="チケットNO"
        ></v-text-field>
        <v-btn  v-on:click="onEntry" text to="/items">Entry</v-btn>
      </v-container>
    </v-app>
  <v-app v-else>
        <el-button type="primary" @click="doLogin" icon="el-icon-user">
          <div>Twitterでログイン</div>
        </el-button>
  </v-app>
</template>

<script>
  import Vue from "vue"
  import axios from 'axios'
  import firebase from 'firebase'
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        twitter_user: {},  
        drawer: true,
        messages:[],
        sessionData:[],
        login:true,
        entry:false,
        twitter_user: {},  
        textarea_ticekt_no:'',
        textarea_dice_command:'',
        dice_num:1,
        dice_face:'6',
        dice_face_option: ['4','6','8','10','12','20','100'],
        dice_target:'',
        bgImg:'',
        audio: new Audio(),
        isPlay: false,
        duration: 0,
        currentTime: 0,
        use_dice_target:false
      };
    },
    created() {
      this.$vuetify.theme.dark = true
      this.fireBaseAuth()
    },
    mounted() {
      this.$store.watch(
        (state, getters) => getters.trpgSessionImg,
        (newValue, oldValue) => {
          this.bgImg = this.$store.getters.trpgSessionImg
        }
      ),
      this.$store.watch(
        (state, getters) => getters.trpgSessionBgm,
        (newValue, oldValue) => {
          if(this.$store.getters.trpgSessionBgm == null){
            this.audio.pause();
            return
          }
          this.audio.src = this.$store.getters.trpgSessionBgm
          this.audio.load();
          this.audio.play();
          this.isPlay = true;
        }
      )
    },
    methods: {
      fireBaseAuth(){
        if(Vue.config.debug =! true){
          console.log("FB Auth")
          firebase.auth().onAuthStateChanged(twitter_user => {
           this.twitter_user = twitter_user ?twitter_user : {}
          })
        }else{
          this.login = true
          this.twitter_user = {
            uid        :'test',
            displayName:'test',
            photoURL   : ''
          }
        }
      },
      doLogin() {
        const provider = new firebase.auth.TwitterAuthProvider()
        firebase.auth().signInWithPopup(provider)
      },
      doLogout() {
      
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
      loadMusic: function(){
        this.audio.src =this.$store.getters.trpgSessionBgm;
        this.audio.load();
        this.audio.play();
        this.isPlay = true;
        this.audio.addEventListener('canplay', () => {
          this.duration = this.audio.duration;
        });
        this.audio.addEventListener('timeupdate', () => {
          this.currentTime = this.audio.currentTime;
        });
        this.audio.addEventListener('ended', ()=> {
          this.audio.currentTime = 0;
          this.audio.play();
        });
      },
      switchMusic: function () {
         this.isPlay = !this.isPlay;
         if(this.isPlay==true){
           this.audio.play();
         }else{
           this.audio.pause();
         }
      },
      async chekTicekt(){
        await axios.get('/uEntry/?format=json&ticket_no='+this.textarea_ticekt_no,
        ).then(response => {
            this.entyrInfo = response.data
        })
        await axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId
        ).then(response => {
          this.sessionData = response.data
        })

        if(typeof this.entyrInfo[0] === 'undefined'){
            alert('存在しないチケットです')
            return
        }
        this.$store.commit('notifyTickesNo',this.entyrInfo[0]['ticket_no'])
        this.$store.commit('notifyTrpgSessionId',this.entyrInfo[0]['trpg_session'])
        this.$store.commit('notifyTrpgSessionName',this.entyrInfo[0]['trpg_session_name'])
        //this.$store.commit('notifyTrpgSessionImg',this.sessionData[0]['trpg_session_image'])
        //this.$store.commit('notifyTrpgSessionBgm',this.sessionData[0]['trpg_session_bgm'])
        this.$store.commit('notifyUserName',this.entyrInfo[0]['name'])
        this.$store.commit('notifySessionUserId',this.entyrInfo[0]['session_user_id'])
        this.$store.commit('notifyTwUID',this.twitter_user.uid)
        this.$store.commit('notifyTwName',this.twitter_user.displayName)
        this.$store.commit('notifyTwPhoto',this.twitter_user.photoURL)
        console.log("this.twitter_user.displayName")
        console.log(this.twitter_user.displayName)

        this.entry = true
        this.$router.push("/story")
        this.loadChatlog();
      },
      async rollDice(){
        var csrftoken = Cookies.get('csrftoken')
        await axios.post(
          '/uDiceRoll/', 
          { 
            session_users:this.$store.getters.sessionUserId, 
            roll_dice_command:this.textarea_dice_command,
            twitter_users_name: this.$store.getters.twName,
            twitter_users_photo:this.$store.getters.twPhoto
          },
          {
            headers: {
              'X-CSRFToken': csrftoken,
            },
          }
        ).then(response => {
          this.postResuolt = response.data
          this.loadChatlog()  
        })
//      this.doFireBaseUpdate()
        this.textarea_dice_command =""
      },
      async loadChatlog(){
          await axios.get('/uDiceLog/?format=json&session_users__trpg_session='+this.$store.getters.trpgSessionId).then(response => {
            this.messages = response.data
          })
          await this.scrollToLastItem()
      },
      loadSession:function(){
          axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
              this.sessionData = response.data
          })
      },  
      scrollToLastItem() {
          this.$vuetify.goTo(99999)
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
          {
            headers: {
            'X-CSRFToken': csrftoken,
            },
          }
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
            this.textarea_dice_command = this.dice_num+"d"+this.dice_face
          }else{
            this.textarea_dice_command = this.dice_num+"d"+this.dice_face+">="+this.dice_target
          }
          this.rollDice() 
        },
       childAdded(snap) {
          //const message = snap.val()
          this.loadChatlog()
        },
        doFireBaseUpdate() {
          if (this.tw_user.uid) {
            // firebase に更新メッセージを送信。他端末で検知を期待。
            firebase.database().ref('message').push({
              message: 'now update'
              }, () => {
                this.textarea_dice_command = ""
              }
            )}
          }      
        }      
  }
</script>

<style>
  @import "./css/styles.css";
</style>
