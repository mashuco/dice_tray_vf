<template>
  <v-card>
    <v-card-title>Component Title</v-card-title>
    <v-card-subtitle v-text="msg"/>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="success" @click="submitYes">
        OK
      </v-btn>
      <v-btn text color="success" @click="submitNo">
        No
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    msg:'',
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
