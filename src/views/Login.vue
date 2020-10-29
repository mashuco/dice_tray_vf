<template>
  <v-app >
    <LoginPage
      v-on:clickSubmit="doLogin" 
      :authloading ="twAuthloading"
    />
  </v-app>
</template>
<script>
  import Vue from "vue"
  import LoginPage from '../components/LoginPage'
  import axiosUtils from '../utils/axiosUtils'

 export default {
    mixins: [
    ],
    components: {
      LoginPage
    },
    data() {
      return {
        twAuthloading:false,
      }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    destoryed: function () {
    },
    methods: {
      doLogin(state) {
        axiosUtils.axiosInitialTw(this.$store.getters.twLinkedAuthKey)
        this.$store.commit('notifyLogin',true)
        this.$emit('routing')
      },
   }      
  }
</script>
<style>
  @import "../css/styles.css"
</style>