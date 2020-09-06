<template>
 <v-container>
    <!--v-dialog v-model="dialog">
      <CialogCard
        v-on:clickSubmit="onSubmit"
        title="確認"
        msg="現在◎◎さんが使用中です"
      ></CialogCard>
    </v-dialog-->
    <v-btn color="success" @click.stop="dialog = true">
      開く!
    </v-btn>
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
              <v-card-subtitle class="pa-1 my-0" v-text="'エントリー中'">
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
            v-model="textareaTicektNo2"
            label="チケットNO"
            @keydown.enter="textAreasubmit()"
        ></v-text-field>
      </v-container>
</template>
<script>
import CialogCard from '../DialogCard'

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
    CialogCard,
  },
  data() {
    return {
      textareaTicektNo2:'',
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
      if(this.textareaTicektNo2===''){
      alert('チケット番号を入力してください')
      return
      }
      this.checkTicet(this.textareaTicektNo2)
    },
    checkTicet(str){
      console.log("str")
      console.log(str)
      var searchTicket = this.ticketData.filter(function(item,index){
        if(item.ticket_no == str)return true
      })
      
      console.log("searchTicket")
      console.log(searchTicket)
      if(searchTicket.length == 0){
          alert('存在しないチケットです')
          return
      }
      this.$emit('clickSubmit',searchTicket)
    }
  }
}
</script>

