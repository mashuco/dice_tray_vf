<template>
  <v-app >
  <v-dialog v-model="dialog" max-width= "500">
    <Dialog
      v-on:clickSubmit="callBack"
      title="確認"
      :msgArr='dialogMsgArr'
      :notification='true'
    ></Dialog>
  </v-dialog>
  <TicketSelectPage
      v-on:select="doSelectTicket" 
      v-on:releaseSession="releaseSession"
      :ticketData = "sessionAllTicketData"
      :loginUsers = "loginUsers"
    />
  </v-app>
</template>
<script>
  import Vue from "vue"
  import firebase from 'firebase/app'
  import 'firebase/database'
  import twitterInfoService from '../services/twitterInfoService'
  import TicketSelectPage from '../components/TicketSelectPage'
  import Dialog from '../components/Dialog'

  export default {
    mixins: [
    ],
    components: {
      TicketSelectPage
    },
    data() {
      return {
        sessionAllTicketData:[],
        loginUsers:[],
        dialog:false,
        dialogMsgArr:[],
        dialogNotification:false,
        dialogLogout:false,
   
      }
    },
    created() {
    },
    mounted() {
        this.loadSelectedSessionInfo(this.$store.getters.ticketId)
      　this.fireBaseTicketStartIni()
    },
    computed: {
    },
    destoryed: function () {
    },
    methods: {
      async loadSelectedSessionInfo(str){
        await this.$axios.get('/uEntry/?format=json&trpg_session='+str,
        ).then(response => {
              this.sessionAllTicketData             = response.data
          }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
        this.selectedUserCheck()  
      },
      async doSelectTicket(searchTicket){
        this.selectTicket(searchTicket)
      },
      releaseSession(){
        this.$store.commit('notifyChoiceSession',false)
        this.$emit("routing")
      },
      selectedUserCheck(){

          var tmp =(this.sessionAllTicketData.find(item => item.tw_UID === this.$store.getters.twUID))
  
          if(tmp==null)
            return
          var selectedTicket =[]
          selectedTicket.push(tmp)
          this.autoSelectTicketForSelecedUser(selectedTicket)
       },
      autoSelectTicketForSelecedUser(selectedTicket){
        if(Vue.config.debug ||this.$store.getters.nonLogin)
          return

        this.doSelectTicket(selectedTicket)
        this.dialogMsgArr.push("使用中のチケット")
        this.dialogMsgArr.push("["+selectedTicket[0].ticket_no+":"+selectedTicket[0].character_name+"]でログインしました")
        this.dialog = true
      },
      fireBaseTicketStartIni(){
        　this.fireBaseTicketStateWatch()
          this.fireBaseTicketDisconectWatch()
          this.fireBaseLiveUpdateLoginUsers()      
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
      fireBaseLiveUpdateLoginUsers(){      
        if(Vue.config.debug ||this.$store.getters.nonLogin)
        {
          //this.loginUsers = ['test']
          return
        }
        
        this.loginUsers = []
        var fbRef = firebase.database().ref('/login/'+this.$store.getters.trpgSessionId+'/')
        fbRef.on('value',this.updateLoginUsers)
      },
      updateLoginUsers(data){
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
      async selectTicket(searchTicket){
        this.entyrInfo = searchTicket
        this.$store.commit('notifyTrpgSessionId',this.entyrInfo[0]['trpg_session'])
        this.$store.commit('notifyTrpgSessionName',this.entyrInfo[0]['trpg_session_name'])
        this.$store.commit('notifyUserName',this.entyrInfo[0]['name'])
        this.$store.commit('notifyIsSessionMaster',this.entyrInfo[0]['is_session_master'])
        this.$store.commit('notifySessionUserId',this.entyrInfo[0]['session_user_id'])

        await this.$axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId
        ).then(response => {
          this.sessionData = response.data
        }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
        this.$store.commit('notifyFirebaseMessageKeyId',this.sessionData[0]['firebase_message_key_id'])
        this.$store.commit('notifyFirebaseSceanKeyId',this.sessionData[0]['firebase_scean_key_id'])
        this.$store.commit('notifyTicketId',this.entyrInfo[0]['ticket_no'])

        await twitterInfoService.regist(
          this.$axios, 
          this.$store.getters.twUID,
          this.$store.getters.twName,
          this.$store.getters.twPhoto,
          this.$store.getters.sessionUserId
        )

        this.fireBaseRegistLoginStatus(this.$store.getters.twUID)

        await this.fireBaseTicketStateUpdate()
        this.$store.commit('notifyEntry',true)
        this.$emit('routing')
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

   }      
  }
</script>
<style>
  @import "../css/styles.css"
</style>