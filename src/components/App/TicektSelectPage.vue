<template>
 <v-container>
  <v-dialog v-model="dialog" max-width= "500">
    <Dialog
      v-on:clickSubmit="emit"
      title="確認"
      :msgArr='dialogMsgArr'
    ></Dialog>
  </v-dialog>
  チケットの選択
  <v-list class="pa-1 my-0" >
    <v-list-item
      v-for="item in ticketDataWithoutGM"
      :key="item.ticket_no"
      class="pa-1 my-0"
      @click="submit(item.ticket_no)"
    >
      <v-card 
        color="#385F73" 
        width="100%" 
        height="250px" 
      >
        <v-card-title class="pa-0 my-0" v-text="'チケット名:'+item.name"/>
        <v-card-subtitle  v-if="nowEntry(item.ticket_no)" class="pa-1 my-0" v-text="'エントリーユーザー中のユーザーがいます'">
        </v-card-subtitle>
        <v-list-item-avatar>
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
  <h2 class = "input_title">マスター：チケット番号を入力</h2>
  <v-text-field
    v-model="textareaTicektNo"
    label="チケットNO"
    @keydown.enter="textAreasubmit()"
  ></v-text-field>
 </v-container>
</template>
<script>
import Dialog from '../Dialog'
export default {
  props: {
    ticketData:{
      type:Array
    },
    ticketDataWithoutGM:{
      type:Array
    }
  },
  components: {
    Dialog,
  },
  computed: {
      nowEntry: function () {
        return function(str){
          var ticket = this.ticketData.filter(function(item,index){
            if(item.ticket_no == str)return true
          })
          if(ticket[0].tw_UID.length == 0){
            return false
          }
          return true
        }
      }
  },
  data() {
    return {
      textareaTicektNo:'',
      searchTicket:[],
      dialogMsgArr:[],
      dialog:false
    }
  },
  methods: {
    submit(str) {
       if(str===""){
        alert('チケット番号がありません')
        return
       }
       this.checkTicet(str)
    },
    textAreasubmit(){
      if(this.textareaTicektNo===''){
      alert('チケット番号を入力してください')
      return
      }
      this.checkTicet(this.textareaTicektNo)
    },
    checkTicet(str){
      this.searchTicket = this.ticketData.filter(function(item,index){
        if(item.ticket_no == str)return true
      })
      if(this.searchTicket.length == 0){
          alert('存在しないチケットです')
          return
      }
      if(this.searchTicket[0].tw_name !=''){
        this.dialogMsgArr.push(this.searchTicket[0].tw_name +"がエントリー中です。利用しますか？")
        this.dialog =true
        return
      }
      this.emit()
    },
    emit(agree){
      this.dialog = false
      if(agree === false)
        return
      this.$emit('clickSubmit',this.searchTicket)
   }
  }
}
</script>

