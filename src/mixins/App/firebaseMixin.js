import Vue from "vue"
import firebase from 'firebase/app'
import "firebase/database"

export default  {
  created:function() {
  },
  data(){
    return {
      dialogLogout:false,
      loginUsers:[]   
    }
  },
  mounted(){
  },
  computed: {
    
  },
  methods:{
    fireBaseAuth(){
      if(Vue.config.debug){
        this.$store.commit('notifyTwUID','test')
        this.$store.commit('notifyTwName','test')
        this.$store.commit('notifyTwPhoto','')
        return
      }

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

      firebase.auth().onAuthStateChanged(user => {
        var twitter_user = user ?user : {}
        this.$store.commit('notifyTwUID',twitter_user.uid)
        this.$store.commit('notifyTwName',twitter_user.displayName)
        this.$store.commit('notifyTwPhoto',twitter_user.photoURL)
        this.fbcost(twitter_user.uid)
      })

    },
    fbcost(uid){
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
    fireBaseRegistLoginStatus(uid){
      const userStatusDatabaseRef = firebase.database().ref('/login/'+this.$store.getters.trpgSessionId+'/'+uid);
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
    fireBaseLiveUpdateLoginUsers(){
      var fbRef = firebase.database().ref('/login/'+this.$store.getters.trpgSessionId+'/')
      fbRef.on('value', function(snapshot) {
        this.loginUsers=snapshot.val()
      })
      console.log("this.loginUsers")
      console.log(this.loginUsers)
    },
    async fireBaseChatMessageStateWatch(){
      if(Vue.config.debug)
        return

      const ref_message = firebase.database().ref('message')
      ref_message.limitToLast(10).on('child_changed',this.chatFirebaseMessageChanged)
    },
    async fireBaseTicketStateUpdate() {
      if(Vue.config.debug)
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
    async fireBaseTicektRelease() {
      if(Vue.config.debug)
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
      if(Vue.config.debug)
        return

      firebase.auth().onAuthStateChanged(user => {
        const ref_message = firebase.database().ref('ticket')
        ref_message.limitToLast(10).on('child_changed', this.ticketStateWatchChanged)
      })
    }, 
    ticketStateWatchChanged(snap) {
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
    },
    fireBaseTicketDisconectWatch(){
      console.log("fbDisconec!")
      var date = new Date()
      firebase.database().ref('ticket').onDisconnect().set(
        {
          ticketId:this.$store.getters.ticketId,
          trpgSessionId:this.$store.getters.trpgSessionId,
          twUID:"",
          updateDate:date.getTime()
        });
    }, 

  }
}

