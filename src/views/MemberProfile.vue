<template>
<v-container>
  MemberProfile
  <v-card
    width="100%"
   >
    <v-list >
      <v-list-item
      v-for="item in profileData"
      :key="item.session_user_id"
      >
        <v-card color="#385F73" width="100%" height="200px">
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-card-title
            v-text="item.title"
            ></v-card-title>
              <v-row>
              <v-col>
                <img  class="character_image_m"  :src="item.character_image"  />
              </v-col>
              <v-col>
                <v-card-title  v-text="item.character_name"/>
                <v-card-subtitle v-text="item.character_profile"/>
              </v-col>
              <!--v-col>
                <img
                class="tw-phot"
                :src="item.tw_photo"
                ></img>
              <v-card-subtitle v-text="item.tw_name"/>
              </v-col-->
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