import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  get Token () {
    return window.sessionStorage.getItem('token')
  },
  get UserName () {
    return window.sessionStorage.getItem('userName')
  },
  get UserId () {
    return window.sessionStorage.getItem('userId')
  },
  get UserImg () {
    return window.sessionStorage.getItem('userImg')
  },
  get unRead () {
    return this.unReadObj;
  }
  
}
const mutations = {
  
  setToken (state, token) {
    window.sessionStorage.setItem('token', token)
  },
  setUser (state, data) {
    window.sessionStorage.setItem('userName', data.userName)
    window.sessionStorage.setItem('userId', data.userId)
  },
  setUserImg(state, img) {
    window.sessionStorage.setItem('userImg', img)
  },
  setUnReadObj (state, obj) {
    state.unReadObj = obj;
  },
  clearUser () {
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('userName')
    window.sessionStorage.removeItem('userId')
    window.sessionStorage.removeItem('userImg')
  }
}
export default new Vuex.Store({
  state,
  mutations
})
