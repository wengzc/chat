import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: false,
    user: {},
    ranUser: {},
    socket: '',
    rooms: {
      1: {
        users: {},
        messages: []
      },
      2: {
        users: {},
        messages: []
      }
    }
  },
  getters: {

  },
  mutations: {
    setLoginState(state, data) {
      state.isLogin = data;
    },
    storeUserInfo(state, data) {
      state.user = data;
    },
    setSocket(state, data) {
      state.socket = data
    },
    setRoomUsers(state, obj) {
      state.rooms[obj.roomId]["users"] = obj.data;
    },
    setRoomMsg(state, obj) {
      state.rooms[obj.roomId]["messages"] = obj.data;
    },
    addRoomMsg(state, obj) {
      state.rooms[obj.roomId]["messages"].push(obj.data)
    },
    setRanUser(state, data) {
      state.ranUser = data;
    }
  },
  actions: {

  }
})
export default store
