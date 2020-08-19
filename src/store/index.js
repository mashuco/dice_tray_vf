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
    sessionSceneId:'',
    twUID :'',
    twName:'',
    twPhoto:'',
    nowScene:''
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
    sessionSceneId(state){
      return state.sessionSceneId
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
    notifySessionSceneId(state,str){
      state.sessionSceneId =str
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
    notifyNowScene(state,str){
      state.nowScene =str
    }
    
  },
  actions: {
  },
  modules: {
  }
})

