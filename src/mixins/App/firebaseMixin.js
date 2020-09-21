import Vue from "vue"
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
    fireBaseMyIni(){
      var firebaseConfig = {
        apiKey:process.env.VUE_APP_FIREBASE_CONFIG_APIKEY ,
        authDomain:process.env.VUE_APP_FIREBASE_CONFIG_AUTHDOMAIN ,
        databaseURL:process.env.VUE_APP_FIREBASE_CONFIG_DATABASEURL ,
        projectId:process.env.VUE_APP_FIREBASE_CONFIG_PROJECTID ,
        storageBucket:process.env.VUE_APP_FIREBASE_CONFIG_STORAGEBUCKET ,
        messagingSenderId:process.env.VUE_APP_FIREBASE_CONFIG_MESSAGINGSENDERID ,
        appId:process.env.VUE_APP_FIREBASE_CONFIG_APPID
       }
      firebase.initializeApp(firebaseConfig);  
    },
    fireBaseAuthState(){
       if(Vue.config.debug==false){
        this.$store.commit('notifyTwUID','test')
        this.$store.commit('notifyTwName','test')
        this.$store.commit('notifyTwPhoto','')
        return        
      }
      
      this.fireBaseMyIni()
      firebase.auth().onAuthStateChanged(user => {
        var twitter_user = user ?user : {}
        const ref_message = firebase.database().ref('message')
        ref_message.limitToLast(10).on('child_changed',this.chatFirebaseMessageChanged)
        this.$store.commit('notifyTwUID',twitter_user.uid)
        this.$store.commit('notifyTwName',twitter_user.displayName)
        this.$store.commit('notifyTwPhoto',twitter_user.photoURL)
        this.fireBaseState(twitter_user.uid)
      })
    },
    fireBaseMyInsertMessage(item,val) {
      if(Vue.config.debug==false)
        return

      firebase.database().ref(item).push({message: 'now update'}, () => {('val') })
    },
    fireBaseState(uid){
      if(Vue.config.debug==false)
        return

      const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
      const isOfflineForDatabase = {
          state: 'offline',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
      };
      const isOnlineForDatabase = {
          state: 'online',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      firebase.database().ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() == false) {
            return;
        };
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
            userStatusDatabaseRef.set(isOnlineForDatabase);
        });
      });
    },
    async ticketFireBaseStateUpdate() {
      if(Vue.config.debug==false)
        return

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
      if(Vue.config.debug==false)
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
    ticketFireBaseStateWatch(){
      if(!Vue.config.debug)
        return

      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('ticket')
        ref_message.limitToLast(10).on('child_changed', this.ticketFirebaseMessageChanged)
      })
    }, 
    ticketFireBaseOnDisconectWatch(){
      if(Vue.config.debug==false)
      return

      firebase.database().ref('ticket').onDisconnect().set(
        {
          ticketId:this.$store.getters.ticketId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          twUID:"",
          updateDate:date.getTime()
        });
    }, 
    ticketFirebaseMessageChanged(snap) {
      if(Vue.config.debug==false)
        return

      if(snap.val().trpgSessionId!=this.$store.getters.trpgSessionId) 
        return

      if(snap.val().twUID==this.$store.getters.twUID) 
        return

      if(snap.val().twUID=="logout"){
        this.loadSession(this.$store.getters.trpgSessionId)
        return
      }

      if(snap.val().ticketId==this.$store.getters.ticketId) {
        this.dialogMsgArr =[]
        this.dialogMsgArr.push("このチケットは他ユーザーに取得されました")
        this.dialogMsgArr.push("強制ログアウトします")
        this.dialogLogout = true
      }
      this.loadSession(this.$store.getters.trpgSessionId)
    }
  }
}

