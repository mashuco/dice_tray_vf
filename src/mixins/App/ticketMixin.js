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
    fireBaseAuthState(){
        firebase.auth().onAuthStateChanged(user => {
          const ref_message = firebase.database().ref('ticket')
          ref_message.limitToLast(10).on('child_changed', this.firebaseTicketMessageChanged)
        })
    }, 
    firebaseTicketMessageChanged(snap) {
      console.log("ticket")
      if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
        return

    },
    
  },
  methods:{

  }
}