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
       
        this.$emit('clickSubmit')
        return
      }
      const provider = new firebase.auth.TwitterAuthProvider()
      await firebase.auth().signInWithPopup(provider) .then(
          result => {
            var token = result.credential.token;
            var secret = result.credential.secret;
console.log("token") 
console.log(token) 
console.log("secret")      
console.log(secret)      
console.log("result!!!!!")
console.log(result)

var user = result.user;
            if (user) {
              const currentUser = {
                displayName: user.displayName,
                photoURL: user.photoURL
              };
            } else {
              alert("有効なアカウントではありません");
            }
          },            
          err => {
            alert(err.message);
          }
        );
      this.twAuthloading = false
       
      this.$emit('clickSubmit')
    },
  }
}
</script>