<template>
  <v-container >
    <v-card   
      class="side-bar-header"
      :width = 'window_width_prop'
      >
        <div style="width:1px; height: 5px"/>
          <v-row class="pa-0 ma-0" justify="start">
            <v-col class="pa-0 ma-0">
                <v-img
                :src="diceImgPath"
                max-height="35" 
                contain
                class="pa-0 ma-0"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
          <v-col class="pa-0 ma-0">
            <v-select  class="pa-0 ma-0"
              v-model="diceSelectedFace"
              :items="diceFaceOptions"
              item-text="name"
              item-value="id"
              outlined
              return-object
              dense
              style="width:90px;"
            ></v-select>
          </v-col>
          <v-col class="pa-2 ma-0">
            <el-input-number 
              style="width:110px;  font-size: 16px; transform: scale(0.8);"
              size="small"
              v-model="diceNum"  
              :min="1" 
              :max="100"
            ></el-input-number>
          </v-col>
          <v-col class="py-3  ma-0">
            <v-btn  outlined small @click="chatOnSelectRollDice">個振る</v-btn>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col class="pa-0 ma-0">
            <v-switch v-model="diceUseTarget"  label="目標"></v-switch>
          </v-col>
          <v-col class="pa-3 ma-0">
            <el-input-number 
              style="width:130px;  font-size: 16px; transform: scale(0.8);"
              size="small"
              :disabled="!diceUseTarget" 
              v-model="diceTarget"  
              :min="1" 
              :max="100"
              ></el-input-number>
          </v-col >
          <v-col class="py-5 ma-0">
            以上
          </v-col >
        </v-row>
        <v-row>
          <v-col class="pa-0 ma-0">
          <v-text-field class="pa-0  ma-0"
            v-model="chatTextarea"
            placeholder="input message..."
            single-line
            append-icon="mdi-chat"
            color="white"
            hide-details
            @keydown.enter="chatOnDiceRoll"
            ></v-text-field>
          </v-col>
        </v-row>
  </v-card >
  </v-container >
</template>

<script>
import Vue from 'vue'

export default {
 created:function() {
  },
  props: {
    window_width_prop:0,
  },
  data(){
    return{
      chatTextarea:"",
      diceNum:1,
      diceFaceOptions: [
        { id: '4', name: '4面' },
        { id: '6', name: '6面' },
        { id: '8', name: '8面' },
        { id: '10', name: '10面' },
        { id: '12', name: '12面' },
        { id: '20', name: '20面' },
        { id: '100', name: '100面' },
      ],
      diceSelectedFace: {id:'6',name:'6面'},
      diceTarget:'',
      diceUseTarget:false,
      diceImgPath: require('@/assets/142187.png'),
    }    
  },
  mounted(){
  },
  computed: {
    dice_tray_wide(){
      if(this.$vuetify.breakpoint.mdAndUp)
        return '100%'
      if(this.$vuetify.breakpoint.smAndDown)
        return '100%'
    },
  },
  methods:{
    chatOnDiceRoll(){
      if(this.chatTextarea===""){
        alert('コマンドを入力してください')
        return
      }

      this.$emit('sendCommand',this.chatTextarea)
      this.chatTextarea =""
    },
    chatOnSelectRollDice(){
      if(this.diceTarget==null || this.diceUseTarget==false){
        this.chatTextarea = this.diceNum+"d"+this.diceSelectedFace.id
      }else{
        this.chatTextarea = this.diceNum+"d"+this.diceSelectedFace.id+">="+this.diceTarget
      }
      this.$emit('sendCommand',this.chatTextarea)
    }

  }

}

</script>
