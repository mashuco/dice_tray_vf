<template>
  <v-container >
    <v-row
      style="height: 300px;"
      justify="center" align-content="center"
    >
      <v-btn 
        block x-large color="#009688"  
        @click="submit" 
        :loading="TwAuthloading"
      >Twitterでログイン</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    authloading:false,
  },
  watch: {
      authloading: function(chenged, old){
        console.log(old+'から'+chenged)
      }
  }, 
  data() {
    return {
      TwAuthloading:false
    }
  },
  methods: {
    async submit() {
     this.TwAuthloading = true

      if(Vue.config.debug){
        alert('AUTO LOGIN')
        this.TwAuthloading =false
       
        this.$emit('clickSubmit')
      }
      const provider = new firebase.auth.TwitterAuthProvider()
      await firebase.auth().signInWithPopup(provider)

      this.TwAuthloading = false
       
      this.$emit('clickSubmit')
    },
  }
}
</script>