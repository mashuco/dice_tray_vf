import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ticketNo:'',
    trpgSessionId:'',
    trpgSessionName:'',
    trpgSessionImg:'',
    trpgSessionBgm:'',
    userName:'',
    sessionUserId:'',
    isSessionMaster:false,
    twUID :'',
    twName:'',
    twPhoto:'',
    nowScene:'',
    firebaseMessageKeyId,
    firebaseSceanKeyId
  },
  getters: {
    ticketNo(state){
      return state.ticketNo
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
    twUID(state){
      return state.twUID
    },
    twName(state){
      return state.twName
    },
    twPhoto(state){
      return state.twPhoto
    },
    nowScene(state){
      return state.nowScene
    },
    firebaseMessageKeyId(state){
      return state.firebaseMessageKeyId
    },
    firebaseSceanKeyId(state){
      return state.nowfirebaseSceanKeyIdScene
    },
   
  },
  mutations: {
    notifyTickesNo(state,str){
      state.ticketNo = str
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
    //notifySessionSceneId(state,str){
    //  state.sessionSceneId =str
    //},
    notifyTwUID(state,str){
      state.twUID =str
    },
    notifyTwName(state,str){
      state.twName =str
    },
    notifyTwPhoto(state,str){
      state.twPhoto =str
    },
    notifyNowScene(state,str){
      state.nowScene =str
    },
    notifyTwPhoto(state,str){
      state.twPhoto =str
    },
    notifyFirebaseMessageKeyId(state,str){
      state.twPhoto =str
    },
    notifyFirebaseSceanKeyId(state,str){
      state.twPhoto =str
    }   

  },
  actions: {
  },
  modules: {
  }
})

