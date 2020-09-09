import {Howl, Howler} from 'howler';
export default  {
    created:function() {
        this.audio=   new Howl({src: [''] });
    },
    data(){
        return {
            audio:null,
            isPlay: false,
            audioVolume:200,
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
              this.audio.unload();
              this.audio  = new Howl({
                src: [this.$store.getters.trpgSessionBgm],
                loop: true,
                volume: (this.audioVolume/100),
              });
              this.audio.play()
           }
        )
    },
    computed: {
   },
    methods:{
      audioVolumeChenge(){
          if(this.audioVolume==0){
            this.audio.volume(0)
            return
          }
          this.audio.volume(this.audioVolume/100)
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