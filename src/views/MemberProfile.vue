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
        <v-card color="#385F73" width="100%" height="320px">
                <v-img  class="character_image_m　pa-0 my-3"  
                 :src="media_url_prefix+item.character_image"   
                  max-height="150" 
                  contain
                >
                  <v-card-title class="pa-0 my-0" v-text="item.character_name"/>
                </v-img>
                <v-text-field readonly class="pa-1 my-0" v-text="item.character_profile"/>
                  <v-list-item-avatar class="pa-0 my-0">
                    <v-img
                      :src="item.tw_photo"
                      max-height="30" 
                      contain
                      >
                    </v-img>
                  </v-list-item-avatar>
                  <v-card-subtitle v-text="item.tw_name" class="py-0 my-0"/>
        </v-card>
      </v-list-item>
    </v-list>
</v-container>

</template>

<script>
import Vue from "vue"
import Cookies from 'js-cookie'
import mediaUtil from '../utils/mediaUtil'


export default {
  data() {
    return {
      profileData:[],
      tw_user: {},  
    }
  },  
  created(){
    
    this.loadAll()
  },  
  computed: {
    media_url_prefix(){
        return mediaUtil.urlPrefix()
    },
  },
  methods: {
    loadAll:function(){
      this.$axios.get('/uEntry/?format=json&is_session_master=false&trpg_session='+this.$store.getters.trpgSessionId).then(response => {
        this.profileData = response.data
        }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
    },
  }
}
</script>