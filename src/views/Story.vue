<template>
    <v-container>
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

    </v-container>
</template>

<script>
import Vue from "vue";
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
      data() {
    return {
      sessionData:[],
      tw_user: {},  // twitterユーザー情報
    };
  },
  created(){
    if(this.$store.getters.sessionUserId == ""){
      this.doTop();
    }
    //this.userName = this.$store.getters.userName
    //this.trpgSessionName = this.$store.getters.trpgSessionName
    //this.trpgSessionId = this.$store.trpgSessionId
    //this.sessionUserId = this.$store.sessionUserId
    this.loadPage()
 },
 methods: {
  doTop:function(){
    this.$router.push("/")
  },
  doMain: function(evnet){
     this.$router.push("/main")
  },
  loadPage:function(){
      axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
          this.sessionData = response.data
      })
  },  
  
 }
}
</script>