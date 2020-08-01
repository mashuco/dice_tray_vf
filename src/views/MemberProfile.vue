<template>
    <v-container>
        MemberProfile
        <v-list>
            <v-list-item
                v-for="item in profileData"
            :key="item.session_user_id"
            >

                <v-list-item-content>
                    <v-list-item-title v-text="item.character_name"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                    <v-list-item-title v-text="item.character_profile"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar>
                <v-img :src="item.character_image"></v-img>
                </v-list-item-avatar>
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
    //if(this.$store.getters.sessionUserId == ""){
    //  this.doTop();
   // }

    this.userName = this.$store.getters.userName
    this.trpgSessionName = this.$store.getters.trpgSessionName
    this.trpgSessionId = this.$store.trpgSessionId
    this.sessionUserId = this.$store.sessionUserId
    
    this.loadAll()
  },  
  methods: {
    //doTop:function(){
    //  this.$router.push("/")
    //},
    doMain: function(evnet){
      this.$router.push("/main")
    },
    loadAll:function(){
      axios.get('/uEntry/?format=json').then(response => {
        this.profileData = response.data
      })
    },
  }
}
</script>