<template>
    <v-container class="pa-0 my-0">
    セッションの選択
        <v-row>
          <v-col>
            <v-list class="pa-1 my-0" >
              <v-list-item
                v-for="item in sessionData"
                :key="item.session_user_id"
                class="pa-1 my-0"
              >
                <v-card 
                  color="#385F73" 
                  width="100%" 
                  height="265px" 
                  @click="submit(item.trpg_session_id)"
                >
                  <v-card-title class="pa-0 my-0" v-text="item.trpg_session_name"/>
                </v-card>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn 
              large color="#009688"  
              @click="pageBack" 
            >戻る</v-btn>
          </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
  props: {
    sessionData:{
      type:Array
    }
  },
  data() {
    return {
    }
  },
  methods: {
    submit(str) {
      this.$emit('clickSubmit',str)
    },
    pageBack(){
      this.$emit('pageBack')
    }
  }
}
</script>
