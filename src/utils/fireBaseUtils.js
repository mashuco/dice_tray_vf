import firebase from 'firebase/app'
import "firebase/database"

export default {
    fireBaseAuth(){
        var firebaseConfig = {
          apiKey:process.env.VUE_APP_FIREBASE_CONFIG_APIKEY ,
          authDomain:process.env.VUE_APP_FIREBASE_CONFIG_AUTHDOMAIN ,
          databaseURL:process.env.VUE_APP_FIREBASE_CONFIG_DATABASEURL ,
          projectId:process.env.VUE_APP_FIREBASE_CONFIG_PROJECTID ,
          storageBucket:process.env.VUE_APP_FIREBASE_CONFIG_STORAGEBUCKET ,
          messagingSenderId:process.env.VUE_APP_FIREBASE_CONFIG_MESSAGINGSENDERID ,
          appId:process.env.VUE_APP_FIREBASE_CONFIG_APPID
         }
        firebase.initializeApp(firebaseConfig)  
      },

}
