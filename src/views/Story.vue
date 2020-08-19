<template>

<v-container>
        <v-card
          max-width="800"
        >
        シーン
       <v-select
          v-model="sceneSelect"
          :items="sceneAllData"
          item-text="scene_name"
          item-value="session_scene_id"
          label="Select"
          persistent-hint
          return-object
          single-line
          return-object
          @change = 'selectScene'

        ></v-select>
       </v-card>

        <!--v-card
          max-width="800"
        >
        <v-list>
          <v-list-item
            v-for="item in sessionData"
            :key="item.session_user_id"
          >
          <v-card color="#385F73" width="100%" height="200px">
            <div class="d-flex flex-no-wrap justify-space-between">
                <v-card-title
                  class="headline"
                  v-text="item.title"
                ></v-card-title>
                <v-row>
              <v-col>
                <v-card-title class="headline" v-text="item.trpg_session_name"/>
                <v-card-subtitle v-text="item.trpg_session_outline"/>
              </v-col>
              </v-row>
            </div>
          </v-card>
          </v-list-item>
        </v-list>
       </v-card-->
      
        <v-card
          max-width="800"
        >
        <v-list>
          <v-list-item
            v-for="item in sceneData"
            :key="item.session_user_id"
          >
          <v-card color="#385F73" width="100%" height="200px">
            <div class="d-flex flex-no-wrap justify-space-between">
                <v-card-title
                  class="headline"
                  v-text="item.title"
                ></v-card-title>
                <v-row>
              <v-col>
                <!--v-card-title class="headline" v-text="item.scene_name"/-->
                <v-card-subtitle v-text="item.scene_outline"/>
              </v-col>
              </v-row>
            </div>
          </v-card>
          </v-list-item>
        </v-list>
       </v-card>

</v-container>
    <!--v-container>
        Story
        <v-list>
            <v-list-item
                v-for="item in sessionData"
            :key="item.trpg_session_id"
            >
                <v-list-item-content>
                    <v-list-item-title v-text="item.trpg_session_outline"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar>
                <v-img :src="item.trpg_session_image"></v-img>
                </v-list-item-avatar>
            </v-list-item>
        </v-list>

    </v-container-->
</template>

<script>
import Vue from "vue";
import axios from 'axios';
import Cookies from 'js-cookie';
import firebase from 'firebase'

export default {
 data() {
    return {
      sessionData:[],
      sceneAllData:[],
      sceneData:[],
      scene_id:'',
      sceneSelect: [],
      tw_user: {},  // twitterユーザー情報
    };
  },
  created(){
    if(this.$store.getters.sessionUserId == ""){
      this.doTop();
    }
    this.loadPage()
    this.loadAllScene()
    this.loadScene(this.$store.getters.nowScene)
    if(Vue.config.solo_mode)
      return
    this.fireBaseAuthState()
    
 },
 mounted() {
 },
 methods: {
  doTop:function(){
    this.$router.push("/")
  },
  doMain: function(evnet){
     this.$router.push("/main")
  },
  async loadPage(){
      await axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
          this.sessionData = response.data
      })
  },  
  async loadAllScene(){
      await axios.get('/scene/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
          this.sceneAllData = response.data
      })
      this.sceneSelect   ={ 
        scene_name:this.sceneAllData[0]['scene_name'], 
        session_scene_id: this.sceneAllData[0]['session_scene_id']
      }
  },  
  async regServeScean(){
      var csrftoken = Cookies.get('csrftoken')
      const formData = new FormData();
      formData.append("trpg_session_now_scene", this.sceneSelect.session_scene_id);
      await axios.patch(
        '/session/'+this.$store.getters.trpgSessionId+'/', 
        formData,
        {
          headers: {
            'X-CSRFToken': csrftoken,
             'content-type': 'multipart/form-data',
          },
        }
      )
  },
  async selectScene() {
    this.regServeScean()
    await axios.get('/scene/?format=json&session_scene_id='+this.sceneSelect.session_scene_id).then(response => {
        this.sceneData = response.data
    })
    this.loadScene(this.sceneSelect.session_scene_id)

    if(Vue.config.solo_mode)
      return
    firebase.database().ref('message').push({
     message: 'storyUpdate|'+this.$store.getters.sessionUserId+'|'+this.sceneSelect.session_scene_id
    })    
  },
  fireBaseAuthState(){
      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('message')
        ref_message.limitToLast(10).on('child_added', this.firebaseMessageAdded)
      })
  },    
  firebaseMessageAdded(snap) {
      var fBmessage = snap.val().message.split('|')
      var fb_message_type = fBmessage[0]
      var fb_send_user_uid = fBmessage[1]
      var fb_scene_id      = fBmessage[2]
      switch(fb_message_type){
        case 'storyUpdate':
         if(fb_send_user_uid!=this.$store.getters.sessionUserId) 
          this.loadScene(fb_scene_id)
        default:
          break
      }
  },
  async loadScene(sceneId){
      await axios.get('/scene/?format=json&session_scene_id='+sceneId).then(response => {
          this.sceneData = response.data
      })
      await this.$store.commit('notifyTrpgSessionImg',this.sceneData[0]['scene_image'])
      await this.$store.commit('notifyTrpgSessionBgm',this.sceneData[0]['scene_bgm'])
      await this.$store.commit('notifySessionSceneId',sceneId)
  },

  
 }
}
</script>