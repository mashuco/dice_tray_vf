<template>
  <v-sheet class="chat-window"
    :width = 'window_width_prop'
  >
    <v-list three-line >
      <v-list-item v-for="item in chatMessages
        " :key="item.text" link >
        <img class="character_image_s"
          :src="mediaImgUrl(item.character_image)"   
       />
        <v-list-item-content>
          <v-textarea
           outlined
           :value="chatMessage(item.roll_dice_command,item.roll_dice_result_sum,item.roll_dice_result_split,item.is_roll_daice_suees)"
           :label="item.character_name +'('+ item.twitter_users_name +')'"
           style="white-space:pre"
           height="70px"
            readonly
          ></v-textarea>
        </v-list-item-content>
      </v-list-item>
    </v-list> 
  </v-sheet>
</template>

<script>
import Vue from 'vue'
import mediaUtils from '../utils/mediaUtils'


export default {
 created:function() {
  },
  props: {
    window_width_prop:0,
    chatMessages:{
      type:Array,
      default:[],
    },

  },
  data(){
    return{
    }    
  },
  mounted(){
  },
  computed: {
  },
  methods:{
    mediaImgUrl(str){
      return mediaUtils.mediaImgUrl(str)
    },
    chatMessage(msg,rollSum,rollResult,SuccessOrFailure) {
      if(rollSum == "") 
      return msg
      if(SuccessOrFailure == null)
      return msg +"\n"+ rollResult+">>"+rollSum
      return msg +"\n"+ rollResult+">>"+rollSum+">>"+ (SuccessOrFailure?"成功":"失敗")
    },
  }

}

</script>
