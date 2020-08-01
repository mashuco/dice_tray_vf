import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ticketNo:'',
    trpgSessionId:'',
    trpgSessionName:'',
    userName:'',
    sessionUserId:'',
    twUID :'',
    twName:'',
    twPhoto:''
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
    userName(state){
      return state.userName
    },
    sessionUserId(state){
      return state.sessionUserId
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
    notifyUserName(state,str){
      state.userName = str
    },
    notifySessionUserId(state,str){
      state.sessionUserId =str
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
    
  },
  actions: {
  },
  modules: {
  }
})

