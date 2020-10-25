import firebase from 'firebase/app'
import "firebase/database"

export default {
    fireBaseAuth(){
      if(Vue.config.debug ||this.$store.getters.nonLogin)
      {
        this.$store.commit('notifyTwUID','test')
        this.$store.commit('notifyTwName','test')
        this.$store.commit('notifyTwPhoto',this.diceImgPath)
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
      firebase.initializeApp(firebaseConfig)  
    },
    fireBaseTicketStartIni(){
      　this.fireBaseTicketStateWatch()
        this.fireBaseTicketDisconectWatch()
        this.fireBaseLiveUpdateLoginUsers()      
    },
    fireBaseRegistLoginStatus(uid){
      if(Vue.config.debug ||this.$store.getters.nonLogin)
        return

      const userStatusDatabaseRef = firebase.database().ref('/login/'+this.$store.getters.trpgSessionId+'/'+uid)
      const isOnlineForDatabase = {
          state: 'online',
         last_changed: firebase.database.ServerValue.TIMESTAMP,
      }

      firebase.database().ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() == false) {
            return
        }
        userStatusDatabaseRef.onDisconnect().remove().then(function() {
            userStatusDatabaseRef.set(isOnlineForDatabase)
        })
      })

    },
    fireBaseLiveUpdateLoginUsers(){      
      if(Vue.config.debug ||this.$store.getters.nonLogin)
      {
        //this.loginUsers = ['test']
        return
      }
      
      this.loginUsers = []
      var fbRef = firebase.database().ref('/login/'+this.$store.getters.trpgSessionId+'/')
      fbRef.on('value',this.UpdateLoginUsers)
    },
    UpdateLoginUsers(data){
      this.loginUsers=[]
      const rootList = data.val()
      const key = data.key
      if(rootList==null) 
        return

      Object.keys(rootList).forEach((val, key) => {
        rootList[val].id = val
        this.loginUsers.push(rootList[val].id)
      })

    },
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
