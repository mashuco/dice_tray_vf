<template>
  <v-card >
    <v-card-title v-text="title"></v-card-title>
      <v-card-subtitle v-for="line in msgArr">{{ line }}</v-card-subtitle>
      <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="success" @click="submitYes">
        OK
      </v-btn>
      <v-btn v-if ="!notification" text color="success" @click="submitNo">
        No
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    title:'',
    msgArr:{
      type:Array,
      default:[],
      required:false
    },
    notification:false
  },
  data() {
    return {
    }
  },
  methods: {
    submitYes() {
      this.agree = true
      this.$emit('clickSubmit', true)
    },
    submitNo() {
      this.agree = false
      this.$emit('clickSubmit', false)
    }
  }
}
</script>
