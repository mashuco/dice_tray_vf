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

