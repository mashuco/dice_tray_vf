<template>
  <v-container >
    <v-row
      style="height: 300px;"
      justify="center" align-content="center"
    >
      <v-btn 
        block x-large color="#009688"  
        @click="submit" 
        :loading="twAuthloading"
      >Twitterでログイン</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import firebase from 'firebase/app'
import "firebase/auth"
import Cookies from 'js-cookie'

export default {
  props: {
    authloading:false,
  },
  data() {
    return {
      twAuthloading:false
    }
  },
  methods: {
    async submit() {
     this.twAuthloading = true
      if(Vue.config.debug){
        alert('AUTO LOGIN')
        this.twAuthloading =false
       
        this.$emit('clickSubmit',true)
        return
      }
      const provider = new firebase.auth.TwitterAuthProvider()
      await firebase.auth().signInWithPopup(provider).then(
        result => {
          if (result.user == null){
              this.twAuthloading = false
              this.$emit('clickSubmit',false)
              return
          }
          //this.$store.commit('notifyTwToken',result.credential.accessToken)
          //this.$store.commit('notifyTwSecretToken',result.credential.secret)  
          this.$store.commit('notifyTwUser',result.user)
          this.$store.commit('notifyTwUID',result.user.uid)
          this.$store.commit('notifyTwName',result.user.displayName)
          this.$store.commit('notifyTwPhoto',result.user.photoURL)

          this.twAuthloading = false
console.log("resultcredential")       
console.log(result.credential)
          this.getKey(result.credential.accessToken,result.credential.secret)

          this.$emit('clickSubmit',true)
        }
      )
    },
    async getKey(twToken,twSecretToken){
      var csrftoken = Cookies.get('csrftoken')
      await this.$axios.post('/twitter/', 
      { 
        access_token:twToken, 
        token_secret:twSecretToken,
      },
      {
        headers: {'X-CSRFToken': csrftoken,},}
      ).then(response => {

        this.$store.commit('notifyTwLinkedAuthKey',response.data.key)
console.log("response.data.key")
console.log(response.data.key)
console.log("this.$store.getters.twLinkedAuthKey")
console.log(this.$store.getters.twLinkedAuthKey)
        return  
      })
    },

  }
}
</script>