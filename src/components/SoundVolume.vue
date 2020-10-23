<template>
  <v-menu class ="menu">
    <template v-slot:activator="{on}">
      <v-btn v-on="on" text >
          <v-icon class="pa-0 ma-0" >volume_mute</v-icon>                
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-content/>
      </v-list-item>
      <v-list-item>
        <v-slider
          v-model="audioVolume"
          min=0
          max=100
          vertical 
          v-on:start = "syncVolume" 
          v-on:end ="audioVolumeChenge"
          v-on:click:prepend = "audioPlayAndPause"
          :prepend-icon="audioIcon"
        ></v-slider>
        {{audioVolume}}
      </v-list-item>
    </v-list>
    </v-menu>
</template>>
<script>
  export default {
    props: {
        parentVolume:0,
        isPlay:true
    },
    created(){
      this.syncVolume()
    },
    data(){
      return {
        audioVolume:0,
      }
    },    
    computed: {
      audioIcon(){
        if(this.isPlay)
          return 'volume_up'
        return'volume_off'
      }
    },
    methods:{
      syncVolume(){
        this.audioVolume  = this.parentVolume
      },
      audioVolumeChenge(){
        this.$emit('audioVolumeChenge',this.audioVolume)
      },
      audioPlayAndPause(){
        this.$emit('audioPlayAndPause')
      },
    }
  }
</script>>