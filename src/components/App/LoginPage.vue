<template>
    <v-container >
      hoge
      <v-row
        style="height: 300px;"
        justify="center" align-content="center"
      >
        <v-btn 
          block x-large color="#009688"  
          @click="submit" 
        >Twitterでログイン</v-btn>
      </v-row>
    </v-container>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
    }
  },
  methods: {
    submit() {
console.log("hoge1")      
      this.$emit('login')
    }
  }
}
</script>