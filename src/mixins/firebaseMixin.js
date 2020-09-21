import Vue from "vue"
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
      if(!Vue.config.debug){
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
      }else{
          this.$store.commit('notifyTwUID','test')
          this.$store.commit('notifyTwName','test')
          this.$store.commit('notifyTwPhoto','')
      }
    },
    fireBaseMyInsertMessage(item,val) {
      firebase.database().ref(item).push({message: 'now update'}, () => {('val') })
    },
    fireBaseState(uid){
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

  }
}

