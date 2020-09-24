<template>

<v-container class="A">
       <v-card width="100%">
       <v-select
          v-model="selectedScene"
          :items="sceneAllData"
          item-text="scene_name"
          item-value="session_scene_id"
          label="Select"
          persistent-hint
          return-object
          single-line
          return-object
          @change = 'selectScene'
         :readonly="!$store.getters.isSessionMaster"
        ></v-select>
       </v-card>

        <v-card width="100%" >
        <v-list>
          <v-list-item
            v-for="item in sceneData"
            :key="item.session_user_id"
          >
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
          </v-list-item>
        </v-list>
       </v-card>
  </v-container>
</template>

<script>
import Vue from "vue"
import Cookies from 'js-cookie'
import Vuetify from 'vuetify/lib'
import firebase from 'firebase/app'
import "firebase/database"

export default {
 data() {
    return {
      sessionData:[],
      sceneAllData:[],
      sceneData:[],
      selectedScene: {scene_name:'',session_scene_id:''},
      isSessionMaster: false,
    };
  },
  created(){

    this.loadStory()
 },
 mounted() {
 },
 methods: {
  doTop:function(){
    this.$router.push("/")
  },
  async loadStory(){
    if(this.$store.getters.nowScene=="")
      await this.loadSession()

    await this.loadSceneAll()
    this.loadScene(this.$store.getters.nowScene)
    this.isSessionMaster =  this.$store.getters.isSessionMaster

    if(Vue.config.debug)
      return
      
    this.fireBaseMessageStateWatch()
  },  
  async loadSession(){
    await this.$axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
      this.sessionData = response.data
    }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
    if(this.$store.getters.nowScene==''){
      this.$store.commit('notifyNowScene',this.sessionData[0]['trpg_session_now_scene'])
    }
  },
  async loadSceneAll(){
    await this.$axios.get('/scene/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
        this.sceneAllData = response.data
    }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
    this.selectedScene   ={ 
      scene_name:this.sceneAllData[0]['scene_name'], 
      session_scene_id: this.sceneAllData[0]['session_scene_id']
    }
  },
  async regServeScean(){
    var csrftoken = Cookies.get('csrftoken')
    const formData = new FormData();
    formData.append("trpg_session_now_scene", this.selectedScene.session_scene_id);
    await this.$axios.patch(
      '/session/'+this.$store.getters.trpgSessionId+'/', 
      formData,
      {
        headers: {
          'X-CSRFToken': csrftoken,
            'content-type': 'multipart/form-data',
        },
      }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
  },
  async selectScene() {
    this.regServeScean()
    await this.$axios.get('/scene/?format=json&session_scene_id='+this.selectedScene.session_scene_id).then(response => {
     this.sceneData = response.data
    }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
    this.loadScene(this.selectedScene.session_scene_id)
    if(Vue.config.debug)
      return

    firebase.database().ref('scene').child(this.$store.getters.firebaseSceanKeyId).update(
      {
        sessionSceneId:this.selectedScene.session_scene_id,
        sessionUserId:this.$store.getters.sessionUserId,
        trpgSessionId:this.$store.getters.trpgSessionId
      }
    );
  },
  fireBaseMessageStateWatch(){
      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('scene')
        ref_message.limitToLast(10).on('child_changed', this.messageChanged)
      })
  }, 
  messageChanged(snap) {
    if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
      return
    if(snap.val().sessionUserId==this.$store.getters.sessionUserId) 
      return
    this.loadScene(snap.val().sessionSceneId)
  },
  async loadScene(sceneId){
    await this.$axios.get('/scene/?format=json&session_scene_id='+sceneId).then(response => {
      this.sceneData = response.data
    }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
    this.$store.commit('notifyNowScene',sceneId)
    this.$store.commit('notifyTrpgSessionImg',this.sceneData[0]['scene_image'])
    this.$store.commit('notifyTrpgSessionBgm',this.sceneData[0]['scene_bgm'])
    
    this.selectedScene   ={ 
      scene_name:this.sceneData[0]['scene_name'], 
      session_scene_id: this.sceneData[0]['session_scene_id']
    }
  },
  
 }
}
</script>