import Cookies from 'js-cookie'
import firebase from 'firebase/app'
import "firebase/database"
import Vue from "vue"

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
    chatInit(){
      this.fireBaseChatMessageStateWatch()
      this.chatLoad()
    },
    async sendCommand(chatTextarea){
      var csrftoken = Cookies.get('csrftoken')
      await this.$axios.post('/uDiceRoll/', 
      { 
        session_users:this.$store.getters.sessionUserId, 
        roll_dice_command:chatTextarea,
        twitter_users_name: this.$store.getters.twName,
        twitter_users_photo:this.$store.getters.twPhoto
      },
      {
        headers: {'X-CSRFToken': csrftoken,},}
      ).then(response => {
        this.postResuolt = response.data
        this.chatLoad()  
      })
      this.doFireBaseChatUpdate()
    },
    async fireBaseChatMessageStateWatch(){
      if(Vue.config.debug ||this.$store.getters.nonLogin)
        return

      const ref_message = firebase.database().ref('message')
      ref_message.limitToLast(1).on('child_changed',this.chatFirebaseMessageChanged)
    },
    doFireBaseChatUpdate() {
      if(Vue.config.debug ||this.$store.getters.nonLogin)
        return

      var date = new Date()
      firebase.database().ref('message').child(this.$store.getters.firebaseMessageKeyId).update(
        {
          sessionUserId:this.$store.getters.sessionUserId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          updateDate:date.getTime()
        }
      )
    },
    scrollToLastItem() {
      this.navDrawerContent = this.$refs['myNavDrawer'].$el.querySelector('div.v-navigation-drawer__content')
      this.$vuetify.goTo(99999 ,{ container:this.navDrawerContent})
    },
    async chatLoad(){
      await this.$axios.get('/uDiceLog/?format=json&session_users__trpg_session='+this.$store.getters.trpgSessionId).then(response => {
        this.chatMessages = response.data
      })
      this.scrollToLastItem()
    },
    chatFirebaseMessageChanged(snap) {
      if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
        return
      if(snap.val().sessionUserId==this.$store.getters.sessionUserId) 
        return
      this.chatLoad()
    },
  },

}