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
    
 },
  mounted() {
    this.$store.watch(
      (state, getters) => getters.sessionSceneId,
      (newValue, oldValue) => {

      }
    )
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
  selectScene() {
    await this.$store.commit('notifySessionSceneId',this.sceneSelect.session_scene_id)
    firebase.database().ref('message').push({
     message: 'storyUpdate|'+this.sceneSelect.session_scene_id
    })

  }      
  
  
 }
}
</script>