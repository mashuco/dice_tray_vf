import regTwitterInfo from '../../services/App/regTwitterInfo'
import Vue from "vue"

export default  {
    created:function() {
    },
    data(){
      return{

      }    
    },
    mounted(){
    },
    computed: {
    },
    methods:{
      selectedUserCheck(){
          var tmp =(this.sessionAllTicketData.find(item => item.tw_UID === this.$store.getters.twUID))
  
          if(tmp==null)
            return
          var selectedTicket =[]
          selectedTicket.push(tmp)
          this.autoSelectTicketForSelecedUser(selectedTicket)
       },
      autoSelectTicketForSelecedUser(selectedTicket){
        if(Vue.config.debug)
          return

        this.doSelectTicket(selectedTicket)
        this.dialogMsgArr.push("使用中のチケット")
        this.dialogMsgArr.push("["+selectedTicket[0].ticket_no+":"+selectedTicket[0].character_name+"]でログインしました")
        this.dialog = true
      },
      async selectTicket(searchTicket){
        this.entyrInfo = searchTicket
        this.$store.commit('notifyTrpgSessionId',this.entyrInfo[0]['trpg_session'])
        this.$store.commit('notifyTrpgSessionName',this.entyrInfo[0]['trpg_session_name'])
        this.$store.commit('notifyUserName',this.entyrInfo[0]['name'])
        this.$store.commit('notifyIsSessionMaster',this.entyrInfo[0]['is_session_master'])
        this.$store.commit('notifySessionUserId',this.entyrInfo[0]['session_user_id'])
        this.entry = true

        await this.$axios.get('/session/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId
        ).then(response => {
          this.sessionData = response.data
        }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
        this.$store.commit('notifyFirebaseMessageKeyId',this.sessionData[0]['firebase_message_key_id'])
        this.$store.commit('notifyFirebaseSceanKeyId',this.sessionData[0]['firebase_scean_key_id'])
        this.$store.commit('notifyTicketId',this.entyrInfo[0]['ticket_no'])

        await regTwitterInfo( 
          this.$axios,
          this.$store.getters.twUID,
          this.$store.getters.twName,
          this.$store.getters.twPhoto,
          this.$store.getters.sessionUserId
        )
        this.fireBaseRegistLoginStatus(this.$store.getters.twUID)

        await this.fireBaseTicketStateUpdate()

        if(this.$route.path!="/story")
          this.$router.push({ name: "story" })

        await this.$axios.get('/scene/?format=json&trpg_session_id='+this.$store.getters.trpgSessionId).then(response => {
            this.sceneAllData = response.data
        })

        this.fireBaseChatMessageStateWatch()
        this.chatLoad()
      },

    }
  }