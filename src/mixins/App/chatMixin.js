import Cookies from 'js-cookie'
import axios from 'axios'
import firebase from 'firebase/app'
import "firebase/database"

export default  {
  created:function() {
  },
  data(){
     return {
      chatMessages:[],
      chatTextarea:'',
    }
  },
  mounted(){
  },
  computed: {
  },
  methods:{
    async sendCommand(){
      var csrftoken = Cookies.get('csrftoken')
      await axios.post('/uDiceRoll/', 
      { 
        session_users:this.$store.getters.sessionUserId, 
        roll_dice_command:this.chatTextarea,
        twitter_users_name: this.$store.getters.twName,
        twitter_users_photo:this.$store.getters.twPhoto
      },
      {
        headers: {'X-CSRFToken': csrftoken,},}
      ).then(response => {
        this.postResuolt = response.data
        this.chatLoad()  
      })
      this.doFireBaseUpdate()
      this.chatTextarea =""
    },
    doFireBaseUpdate() {
      var date = new Date()
      firebase.database().ref('message').child(this.$store.getters.firebaseMessageKeyId).update(
        {
          sessionUserId:this.$store.getters.sessionUserId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          updateDate:date.getTime()
        }
      );
    },
    scrollToLastItem() {
      this.navDrawerContent = this.$refs['myNavDrawer'].$el.querySelector('div.v-navigation-drawer__content');
      this.$vuetify.goTo(99999 ,{ container:this.navDrawerContent})
    },
    async chatLoad(){
      await axios.get('/uDiceLog/?format=json&session_users__trpg_session='+this.$store.getters.trpgSessionId).then(response => {
        this.chatMessages = response.data
      })
      this.scrollToLastItem()
    },
    chatMessage(msg,rollSum,rollResult,SuccessOrFailure) {
      if(rollSum == "") 
      return msg
      if(SuccessOrFailure == null)
      return msg +"\n"+ rollResult+">>"+rollSum
      return msg +"\n"+ rollResult+">>"+rollSum+">>"+ (SuccessOrFailure?"成功":"失敗")
    },
    chatOnDiceRoll:function(event){
      if(this.chatTextarea===""){
        alert('コマンドを入力してください')
        return
      }
      this.sendCommand() 
    },
    chatFirebaseMessageChanged(snap) {
console.log("FBnotifyChat")      
      if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
        return
      if(snap.val().sessionUserId==this.$store.getters.sessionUserId) 
        return
      this.chatLoad()
    },
    chatOnSelectRollDice:function(event){
      if(this.diceTarget==null || this.diceUseTarget==false){
        this.chatTextarea = this.diceNum+"d"+this.diceSelectedFace.id
      }else{
        this.chatTextarea = this.diceNum+"d"+this.diceSelectedFace.id+">="+this.diceTarget
      }
      this.sendCommand() 
    },
  },

}