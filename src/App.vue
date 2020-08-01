<template>
  <v-app  v-if="entry">
    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        stateless
        width = "65%"
    >
    
      <v-container class="fill-height">
      <v-row
      justify="center"
      >
      <v-col class="shrink">
      <div style="width:1px; height: 170px"></div>
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
          <span class="title">Donante</span>
        </v-toolbar-title>
        <v-container>
        </v-container>
    </v-app-bar>
</div>
    <v-main>
      <div class="side-bar">
        <v-container>
          <div class="side-bar-header">
            <div style="width:1px; height: 50px"></div>
            <v-row >
              <v-col>
                <v-btn txet to="/member_profile" @click="drawer = true">member_profile</v-btn>
              </v-col>
              <v-col>
                <v-btn text to="/my_profile" @click="drawer = true">MyProfile</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
              <v-btn text to="/items" @click="drawer = true">items</v-btn>
              </v-col>
              <v-col>
              <v-btn text to="/story" @click="drawer = true">story</v-btn>
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
                  value="6"
                  outlined
                ></v-select>
              </v-col>
              <v-col >
                面ダイスを
              </v-col>
              <v-col >
                <el-input-number v-model="dice_num"  :min="1" :max="100"></el-input-number>
              </v-col>
              <v-col >
                個
              </v-col>
              <v-col >
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
          <div class="side-bar-main">
            <v-row >
              <v-list three-line
                min-width="500px">
                <v-list-item
                  v-for="item in messages"
                  :key="item.text"
                  link
                >
                  <!--v-list-item-avatar>
                    <v-img :src="item.twitter_users_photo" />
                  </v-list-item-avatar>
                  <v-list-item-title v-text="item.twitter_users_name"></v-list-item-title-->

                  <v-list-item-avatar>
                    <v-img :src="item.character_image"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <!--v-list-item-title v-html="item.character_name"></v-list-item-title-->
                    <!--v-list-item-subtitle v-html="item.roll_dice_command"></v-list-item-subtitle-->
                    <v-textarea
                        outlined
                        :value="sideBarMesage(item.roll_dice_command,item.roll_dice_result_sum)"
                        :label="item.character_name"
                        style="white-space:pre"
                        height="70px"
                    ></v-textarea>
                  </v-list-item-content>

<!--
                  <v-list-item-avatar>
                    <v-img :src="item.character_image" class="character_image_s" />
                  </v-list-item-avatar>
                  <v-list-item-title v-text="item.character_name"></v-list-item-title>
                  <v-list-item-title v-text="item.roll_dice_command"></v-list-item-title>
                  <v-list-item-title v-text=">>>>>item.roll_dice_result_sum"></v-list-item-title>
-->
                </v-list-item>
              </v-list> 
            </v-row>
          </div>
        </v-container>
      </div>
    </v-main>
  </v-app>
  <v-app v-else>
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
</template>

<script>
  import Vue from "vue"
  import axios from 'axios'
  import firebase from 'firebase'
  import Cookies from 'js-cookie';
  
  export default {
    data() {
      return {
        drawer: false,
        messages:[],
        entry:false,
        twitter_user: {},  
        textarea_ticekt_no:'',
        textarea_dice_command:'',
        dice_num:1,
        dice_face: 6,
        dice_face_option: ['4','6','8','10','12','20','100']
      };
    },
    created () {
      this.$vuetify.theme.dark = true
    },
    methods: {
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
        this.$store.commit('notifySessionUserId',this.entyrInfo[0]['session_user_id'])
        this.$store.commit('notifyTwUID',this.twitter_user.uid)
        this.$store.commit('notifyTwName',this.twitter_user.displayName)
        this.$store.commit('notifyTwPhoto',this.twitter_user.photoURL)
        this.entry = true
        this.loadPage();

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
          this.loadPage()  
        })
//      this.doFireBaseUpdate()
      },
      async loadPage(){
          await axios.get('/uDiceLog/?format=json&session_users__trpg_session='+this.$store.getters.trpgSessionId).then(response => {
            this.messages = response.data
          })
          await this.scrollToLastItem()
      },
      scrollToLastItem() {
          this.$vuetify.goTo(99999)
      },
      sideBarMesage(str1,str2) {
        if(str2 == "") 
          return str1

        return str1 +"\n"+ ">>>>>>>"+str2
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
          this.textarea_dice_command = this.dice_face+"d"+this.dice_num
          this.rollDice() 
        },
       childAdded(snap) {
          //const message = snap.val()
          this.loadPage()
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
