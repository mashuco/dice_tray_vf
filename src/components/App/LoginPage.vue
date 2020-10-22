<template>
    <v-container >
      <v-row
        style="height: 300px"
        justify="center" align-content="center"
      >
        <v-btn 
          block x-large color="#009688"  
          @click="submit" 
          :loading="twAuthloading"
        >{{this.buttonText}}</v-btn>
      </v-row>
      <v-row v-if=(this.testModeCheckbox) >
          <v-text-field
            v-model="testUserPassWord"
            :type="'password'"
            label="パスワード"
            @keydown.enter="submit()"
          ></v-text-field>
      </v-row>
      <v-row>
          <v-checkbox
            v-model="testModeCheckbox"
            label="Twitterログインしない(Test User)"
          ></v-checkbox>
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
      twAuthloading:false,
      testModeCheckbox:false,
      testUserPassWord:'',
      diceImgPath: require('@/assets/142187.png'),
    }
  },
  computed:{
    buttonText(){
      if(this.testModeCheckbox==false){
        return 'Twitterでログイン'
      this.$store.commit('notifyNonLogin',false)
      }
      this.$store.commit('notifyNonLogin',true)
      return 'ログイン'
    }
  },
  methods: {
    async submit() {
     this.twAuthloading = true
      if(Vue.config.debug==true)
      {
        alert('AUTO LOGIN')
        this.twAuthloading =false
       
        this.$emit('clickSubmit',true)
        return
      }
      if(this.testModeCheckbox==true){
        this.$store.commit('notifyTwUID','test')
        this.$store.commit('notifyTwName','test')
        this.$store.commit('notifyTwPhoto',this.diceImgPath)
        this.twAuthloading = false
        this.getKeyTestMode()
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
          this.getKey(result.credential.accessToken,result.credential.secret)

        }
      )
    },
    async getKeyTestMode(){
      var csrftoken = Cookies.get('csrftoken')
      await this.$axios.post('/rest-auth/login/', 
      { 
        username:process.env.VUE_APP_TEST_USER_NAME, 
        password:this.testUserPassWord,//process.env.VUE_APP_TEST_USER_PASS,
      },
      {
        headers: {'X-CSRFToken': csrftoken,},}
      ).then(response => {
        this.$store.commit('notifyTwLinkedAuthKey',response.data.key)
        this.$emit('clickSubmit',true)
      }).catch(error => {
        alert('パスワードが不正です')
      })
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
        this.$emit('clickSubmit',true)
      })
    },

  }
}
</script>