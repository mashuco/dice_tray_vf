<template>
    <v-container>
      <v-card color="#385F73" width="100%" height="300px">
        <div class="d-flex flex-no-wrap justify-space-between">
          <v-row>
            <v-col>
              <v-text-field
                  class="headline"
                  v-model="character_name"
                  label="キャラクター名"
              ></v-text-field>
            </v-col>
            <v-col>
              <img :src="character_image"/>
              <v-file-input
                v-model="img_file"
                @change="getFileName"
                accept="image/*"
                label="File input"
              ></v-file-input>
            </v-col>
            <v-col>
              <v-textarea
                  outlined
                  v-model="character_profile"
                  label="プロフィール"
              ></v-textarea>
            </v-col>
            <v-col>
              <v-btn  v-on:click="doRegistory">登録</v-btn>
            </v-col>
            </v-row>
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
