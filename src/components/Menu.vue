<template>
  <v-menu class ="menu">
    <template v-slot:activator="{on}">
      <v-btn v-on="on" text>Menu</v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-content/>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title  @click="doStory">Story</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title  @click="doMemberProfile">Party</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title  @click="doMyProfile">my_profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title  @click="doLogout">Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import Vue from 'vue'


export default {
 created:function() {
  },
  props: {

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
    doStory(){
      this.$emit('doStory')
    },
    doMemberProfile(){
      this.$emit('doMemberProfile')
    },
    doMyProfile(){
      this.$emit('doMyProfile')
    },
    doLogout(){
      this.$emit('doLogout')
    },
  }

}

</script>
