<template>
<v-container class="pa-0 my-0">
  MemberProfile
    <v-list 
      class="pa-1 my-0"
    >
      <v-list-item
        v-for="item in profileData"
        :key="item.session_user_id"
        class="pa-1 my-0"
      >
        <v-card color="#385F73" width="100%" height="250px">
                <v-img  class="character_image_m　pa-0 my-5"  
                  :src="item.character_image"   
                  max-height="150" 
                  contain
                >
                  <v-card-title class="pa-0 my-0" v-text="item.character_name"/>
                </v-img>
                <v-card-subtitle class="pa-0 my-0" v-text="item.character_profile"/>
                <img
                class="tw-phot"
                :src="item.tw_photo"
                ></img>
              <v-card-subtitle v-text="item.tw_name"/>
        </v-card>
      </v-list-item>
    </v-list>
</v-container>


</template>

<script>
import Vue from "vue";
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      profileData:[],
      tw_user: {},  // twitterユーザー情報
    };
  },  
  created(){
    
    this.loadAll()
  },  
  methods: {
    loadAll:function(){
      axios.get('/uEntry/?format=json&is_session_master=false&trpg_session='+this.$store.getters.trpgSessionId).then(response => {
        this.profileData = response.data
      })
    },
  }
}
</script>