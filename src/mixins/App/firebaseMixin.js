import Vue from "vue"
import firebase from 'firebase/app'
import "firebase/database"

export default  {
  created:function() {
  },
  data(){
  },
  mounted(){
  },
  computed: {
    
  },
  methods:{
    async fireBaseTicketStateUpdate() {
      if(Vue.config.debug ||this.$store.getters.nonLogin)
        return

      var date = new Date()
      firebase.database().ref('ticket').child(this.$store.getters.firebaseMessageKeyId).update(
        {
          ticketId:this.$store.getters.ticketId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          twUID:this.$store.getters.twUID,
          updateDate:date.getTime()
        }
      )
    },
    async fireBaseTicketRelease() {
      if(Vue.config.debug ||this.$store.getters.nonLogin)
        return

      var date = new Date()
      firebase.database().ref('ticket').child(this.$store.getters.firebaseMessageKeyId).update(
      {
        ticketId:this.$store.getters.ticketId,
        trpgSessionId:this.$store.getters.trpgSessionId,
        twUID:'logout',
        updateDate:date.getTime()
        }
      )
      firebase.auth().signOut()
    },
    fireBaseTicketStateWatch(){
      if(Vue.config.debug ||this.$store.getters.nonLogin)
        return

      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('ticket')
        ref_message.limitToLast(1).on('child_changed', this.ticketStateWatchChanged)
      })
    }, 
    ticketStateWatchChanged(snap) {
      if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
        return

      if(snap.val().twUID==this.$store.getters.twUID) 
        return
     
      if(snap.val().twUID=="logout"){
        this.loadSelectedSessionInfo(this.$store.getters.trpgSessionId)
        return
      }

      if(snap.val().ticketId==this.$store.getters.ticketId) {
        this.dialogMsgArr =[]
        //this.dialogMsgArr.push(" snap.val().twUID::::"+ snap.val().twUID)
        //this.dialogMsgArr.push("this.$store.getters.twUID:::"+this.$store.getters.twUID)
        //this.dialogMsgArr.push("snap.val().ticketId:::"+snap.val().ticketId)
        //this.dialogMsgArr.push("this.$store.getters.ticketId::::"+this.$store.getters.ticketId)
        
        this.dialogMsgArr.push("このチケットは他ユーザーに取得されました")
        this.dialogMsgArr.push("強制ログアウトします")
        this.dialogLogout = true
      }
      this.loadSelectedSessionInfo(this.$store.getters.trpgSessionId)
    },
    fireBaseTicketDisconectWatch(){
      if(Vue.config.debug ||this.$store.getters.nonLogin)
        return

      var date = new Date()
      firebase.database().ref('ticket').onDisconnect().set(
        {
          ticketId:this.$store.getters.ticketId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          twUID:"",
          updateDate:date.getTime()
        })
    }, 
    fireBaseMessageSceneStateWatch(){
      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('scene')
        ref_message.limitToLast(1).on('child_changed', this.messageChanged)
      })
    }, 
    fireBaseMessageSceneStateUpdate(){
      firebase.database().ref('scene').child(this.$store.getters.firebaseSceanKeyId).update(
        {
          sessionSceneId:this.selectedScene.session_scene_id,
          sessionUserId:this.$store.getters.sessionUserId,
          trpgSessionId:this.$store.getters.trpgSessionId
        }
      )
    },
  }
}

