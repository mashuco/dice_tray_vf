<template>
    <v-container>
        Item
        <v-card
          max-width="800"
        >

        <v-list>
          <v-list-item
            v-for="item in itemData"
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
                  <img  class="item_image_s"  :src="item.item_image"  />
              </v-col>
              <v-col>
                <v-card-title class="headline" v-text="item.item_name"/>
                <v-card-subtitle v-text="item.item_explanation"/>
                <v-card-subtitle v-text="item.item_count"/>
              </v-col>
              </v-row>
            </div>
          </v-card>
          </v-list-item>
        </v-list>
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
      itemData:[],
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
    
    this.load()
  },  
  methods: {
    //doTop:function(){
    //  this.$router.push("/")
    //},
    doMain: function(evnet){
      this.$router.push("/main")
    },
    load:function(){
      axios.get('/item/?format=json&item_owner='+this.$store.getters.sessionUserId).then(response => {
        this.itemData = response.data
      })
    },
  }
}
</script>