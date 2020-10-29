import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login:false,
    choiceSession:false,
    entry:false,

    nonLogin:false,
    ticketId:'',
    trpgSessionId:'',
    trpgSessionName:'',
    trpgSessionImg:'',
    trpgSessionBgm:'',
    userName:'',
    sessionUserId:'',
    isSessionMaster:false,
    twLinkedAuthKey:'',
    twUser:[],
    twUID :'',
    twName:'',
    twPhoto:'',
    nowSessionId:'',
    nowScene:'',
    firebaseMessageKeyId:'',
    firebaseSceanKeyId:''
  },
  getters: {
    login(state){
      return state.login
    },
    choiceSession(state){
      return state.choiceSession
    },
    entry(state){
      return state.entry
    },
    nonLogin(state){
      return state.nonLogin
    },
    ticketId(state){
      return state.ticketId
    },
    trpgSessionId(state){
      return state.trpgSessionId
    },
    trpgSessionName(state){
      return state.trpgSessionName
    },
    trpgSessionImg(state){
      return state.trpgSessionImg
    },
    trpgSessionBgm(state){
      return state.trpgSessionBgm
    },
    userName(state){
      return state.userName
    },
    sessionUserId(state){
      return state.sessionUserId
    },
    isSessionMaster(state){
      return state.isSessionMaster
    },
    twLinkedAuthKey(state){
      return state.twLinkedAuthKey
    },
    twUser(state){
      return state.twUser
    },
    twUID(state){
      return state.twUID
    },
    twName(state){
      return state.twName
    },
    twPhoto(state){
      return state.twPhoto
    },
    nowSessionId(state){
      return state.nowSessionId
    },
    nowScene(state){
      return state.nowScene
    },
    firebaseMessageKeyId(state){
      return state.firebaseMessageKeyId
    },
    firebaseSceanKeyId(state){
      return state.firebaseSceanKeyId
    },
   
  },
  mutations: {
    notifyLogin(state,bool){
      state.login = bool
    },
    notifyChoiceSession(state,bool){
      state.choiceSession = bool
    },
    notifyEntry(state,bool){
      state.entry = bool
    },
    notifyNonLogin(state,bool){
      state.nonLogin = bool
    },
    notifyTicketId(state,str){
      state.ticketId = str
    },
    notifyTrpgSessionId(state,str){
      state.trpgSessionId = str
    },
    notifyTrpgSessionName(state,str){
      state.trpgSessionName = str
    },
    notifyTrpgSessionImg(state,str){
      state.trpgSessionImg =str
    },
    notifyTrpgSessionBgm(state,str){
      state.trpgSessionBgm =str
    },
    notifyUserName(state,str){
      state.userName = str
    },
    notifySessionUserId(state,str){
      state.sessionUserId =str
    },
    notifyIsSessionMaster(state,bool){
      state.isSessionMaster =bool
    },
    notifyTwLinkedAuthKey(state,str){
      state.twLinkedAuthKey =str
    },    
    notifyTwUser(state,arr){
      state.twUser = arr
    },
    notifyTwUID(state,str){
      state.twUID =str
    },
    notifyTwName(state,str){
      state.twName =str
    },
    notifyTwPhoto(state,str){
      state.twPhoto =str
    },
    notifyNowSessionId(state,str){
      state.nowSessionId =str
    },
    notifyNowScene(state,str){
      state.nowScene =str
    },
    notifyTwPhoto(state,str){
      state.twPhoto =str
    },
    notifyFirebaseMessageKeyId(state,str){
      state.firebaseMessageKeyId =str
    },
    notifyFirebaseSceanKeyId(state,str){
      state.firebaseSceanKeyId =str
    }   

  },
  actions: {
  },
  modules: {
  }
})

