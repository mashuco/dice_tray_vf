<template>
    <div class="main-contens">
    <v-container>
      <v-img :src="character_image" ></v-img>
      <v-file-input
        v-model="img_file"
        @change="getFileName"
        accept="image/*"
        label="File input"
      ></v-file-input>
      <v-text-field
          v-model="character_name"
          label="キャラクター名"
       ></v-text-field>
       <v-textarea
          outlined
          v-model="character_profile"
          label="プロフィール"
       ></v-textarea>
      <v-btn  v-on:click="doRegistory">Entry</v-btn>
    </v-container>
    </div>
    
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
    if(this.$store.getters.sessionUserId == ""){
      this.doTop();
    }
    
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
