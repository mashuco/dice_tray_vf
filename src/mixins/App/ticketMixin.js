import firebase from 'firebase/app'
import "firebase/database"

export default  {
  created:function() {
  },
  data(){
      return {
        dialogLogout:false,       
    }
  },
  mounted(){
  },
  computed: {
    
  },
  methods:{
    async ticketFireBaseStateUpdate() {
      var date = new Date()
      firebase.database().ref('ticket').child(this.$store.getters.firebaseMessageKeyId).update(
        {
          ticketId:this.$store.getters.ticketId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          twUID:this.$store.getters.twUID,
          updateDate:date.getTime()
        }

      );
    },
    async ticketFireBaseStateUpdateTicektRelease() {
      var date = new Date()
      await firebase.database().ref('ticket').child(this.$store.getters.firebaseMessageKeyId).update(
        {
          ticketId:this.$store.getters.ticketId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          twUID:'',
          updateDate:date.getTime()
        }
      );
    },
    ticketFireBaseStateWatch(){
      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('ticket')
        ref_message.limitToLast(10).on('child_changed', this.firebaseTicketMessageChanged)
      })
    }, 
    firebaseTicketMessageChanged(snap) {
      if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
        return

      if(snap.val().twUID==this.$store.getters.twUID) 
        return

      if((snap.val().twUID!="")&&(snap.val().ticketId==this.$store.getters.ticketId)) {
        this.dialogMsgArr =[]
        this.dialogMsgArr.push("このチケットは他ユーザーに取得されました")
        this.dialogMsgArr.push("強制ログアウトします")
        this.dialogLogout = true
      }
      this.updateTicketList()
    },updateTicketList(){
      this.onSelectSession(this.$store.getters.trpgSessionId)
    }

  }
}