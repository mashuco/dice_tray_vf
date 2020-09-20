export default  {
  created:function() {
  },
  data(){
    return{
      diceNum:1,
      diceFaceOptions: [
        { id: '4', name: '4面' },
        { id: '6', name: '6面' },
        { id: '8', name: '8面' },
        { id: '10', name: '10面' },
        { id: '12', name: '12面' },
        { id: '20', name: '20面' },
        { id: '100', name: '100面' },
      ],
      diceSelectedFace: {id:'6',name:'6面'},
      diceTarget:'',
      diceUseTarget:false,
      diceImgPath: require('@/assets/142187.png'),
    }    
  },
  mounted(){
  },
  computed: {
    dice_tray_wide(){
      if(this.$vuetify.breakpoint.mdAndUp)
        return '100%'
      if(this.$vuetify.breakpoint.smAndDown)
        return '100%'
    },
  },
  methods:{
  }
}