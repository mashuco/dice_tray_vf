export default  {
  created:function() {
    this.audio=   new Audio()
    this.loop = true
    this.audio.volume = this.audioVolume/100
  },
  data(){
      return {
      audio:null,
      isPlay: false,
      audioVolume:10,
      bgmSrc:[],
    }
  },
  mounted(){
    this.$store.watch(
      (state, getters) => getters.trpgSessionBgm,
      (newValue, oldValue) => {
        if(this.entry != true)
          return

        if(this.$store.getters.trpgSessionBgm == null){
          this.audio.pause()
          return
        }
        this.audio.src = this.$store.getters.trpgSessionBgm
        this.audioStart()
      }
    )
  },
  
  computed: {
    audioIcon(){
      if(this.isPlay)
        return 'volume_up'
      return'volume_off'
    }
  },
  methods:{
    audioVolumeChenge2(volume){
      if(this.audioVolume==0){
        this.audio.volume = 0
        return
      }
        this.audioVolume = volume
        this.audio.volume =this.audioVolume/100

    },
    audioVolumeChenge(){
    if(this.audioVolume==0){
      this.audio.volume = 0
      return
    }
      this.audio.volume =this.audioVolume/100
    },
    audioPlayAndPause: function () {
      this.isPlay = !this.isPlay
      if(this.isPlay==true){
        this.audio.play()
      }else{
      this.audio.pause()
      }
    },
    audioStart:function(){
      this.audio.load()
      this.audio.play()
      this.isPlay=true
    }

  }
}