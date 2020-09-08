<template>
  <v-container >
    <v-row
      style="height: 300px;"
      justify="center" align-content="center"
    >
      <v-btn 
        block x-large color="#009688"  
        @click="submit" 
        :loading="authloading"
      >Twitterでログイン</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    authloading:false,
  },
  data() {
    return {
    }
  },
  methods: {
    submit() {

      this.$emit('clickSubmit')
    },
  }
}
</script>