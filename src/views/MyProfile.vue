<template >
    <v-container class="pa-0 my-0">
      <v-card color="#385F73" width="100%"  class="pa-2 my-">
        <v-row
          class="py-0 my-0"
        >
              <v-text-field
                  outlined
                  class="headline"
                  v-model="character_name"
                  label="キャラクター名"
                  append-icon="mdi-fountain-pen-tip"
              ></v-text-field>
        </v-row>
        <v-card-subtitle class="pa-0 ma-0">
          <v-img 
            :src="character_image"  
            max-height="180" 
            contain />
          <v-file-input
            v-model="img_file"
            @change="getFileName"
            accept="image/*"
            label="File input"
          ></v-file-input>
        </v-card-subtitle>
        <v-card-text class="pa-1 ma-0">
            <v-textarea
              outlined
              v-model="character_profile"
              label="プロフィール"
              append-icon="mdi-fountain-pen-tip"
              class="pa-0 ma-0"
            />
        </v-card-text>
       <div
        align="center"
        style="padding:0px; margin:5px"
       >
        <v-btn v-on:click="doRegistory" block  color="warning">登録</v-btn>
       </div>
      </v-card>
    </v-container>
</template>

<script>
import Vue from "vue";
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      character_name:'',
      character_profile:'',
      character_image:'',
      character_img_upfile:'',
      profileData:[],
      tw_user: {},  // twitterユーザー情報
      img_file:null  
    };
  },
  created(){
    this.loadProfile()
  },
  methods: {
    async loadProfile(){
      await axios.get('/uEntry/?format=json&session_user_id='+this.$store.getters.sessionUserId).then(response => {
            this.profileData = response.data
      })
      this.character_name = this.profileData[0]['character_name']
      this.character_profile = this.profileData[0]['character_profile']  
      this.character_image = this.profileData[0]['character_image']  
      
    },
    getFileName(e) {
        this.imageFile = e.name
    },      
    async doRegistory(){
      var csrftoken = Cookies.get('csrftoken')
      const formData = new FormData();
      formData.append("character_name", this.character_name);
      formData.append("character_profile",  this.character_profile);
      if(this.img_file != null)
        formData.append("character_image", this.img_file);
 
      await axios.patch(
        '/userUp/'+this.$store.getters.sessionUserId+'/', 
        formData,
        {
          headers: {
            'X-CSRFToken': csrftoken,
             'content-type': 'multipart/form-data',
          },
        }
      ).then(response => {this.postResuolt = response.data })
        this.img_file = null
        this.loadProfile()
    },
  }
}
</script>
