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
         :readonly="!isSessionMaster"
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

export default {
 data() {
    return {
      sessionData:[],
      sceneAllData:[],
      sceneData:[],
      selectedScene: {scene_name:'',session_scene_id:''},
      tw_user: {},  // twitterユーザー情報
      isSessionMaster: false,
    };
  },
  created(){
    if(this.$store.getters.sessionUserId == ""){
      this.doTop();
    }
    this.loadPage()
    this.loadAllScene()
    this.loadScene(this.$store.getters.nowScene)
    this.isSessionMaster =  this.$store.getters.isSessionMaster

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
  async loadPage(){
      await axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
          this.sessionData = response.data
      })
  },  
  async loadAllScene(){
      await axios.get('/scene/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
          this.sceneAllData = response.data
      })
      this.selectedScene   ={ 
        scene_name:this.sceneAllData[0]['scene_name'], 
        session_scene_id: this.sceneAllData[0]['session_scene_id']
      }
  },  
  async regServeScean(){
      var csrftoken = Cookies.get('csrftoken')
      const formData = new FormData();
      formData.append("trpg_session_now_scene", this.selectedScene.session_scene_id);
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
    await axios.get('/scene/?format=json&session_scene_id='+this.selectedScene.session_scene_id).then(response => {
        this.sceneData = response.data
    })
    this.loadScene(this.selectedScene.session_scene_id)

    if(Vue.config.solo_mode)
      return

    firebase.database().ref('scene').child(this.$store.getters.firebaseSceanKeyId).update(
      {sessionSceneId: this.selectedScene.session_scene_id,sessionUserId:this.$store.getters.sessionUserId}
    );
},
  fireBaseAuthState(){
      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('scene')
        ref_message.limitToLast(10).on('child_changed', this.firebaseMessageChanged)
      })
  },    
  firebaseMessageChanged(snap) {
    if(snap.val().sessionUserId==this.$store.getters.sessionUserId) 
      return
    this.loadScene(snap.val().sessionSceneId)
  },
  async loadScene(sceneId){
      await axios.get('/scene/?format=json&session_scene_id='+sceneId).then(response => {
          this.sceneData = response.data
      })
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