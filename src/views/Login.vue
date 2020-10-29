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
        this.$store.commit('notifyLogin',true)
        this.$emit('routing')
      },
   }      
  }
</script>
<style>
  @import "../css/styles.css"
</style>