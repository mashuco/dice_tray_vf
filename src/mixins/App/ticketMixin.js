import Cookies from 'js-cookie'
import axios from 'axios'
import firebase from 'firebase/app'
import "firebase/database"

export default  {
  created:function() {
  },
  data(){
      return {
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

    },

  }
}