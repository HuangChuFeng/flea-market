import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  currentdata: {
    get UserName () {
      return window.sessionStorage.getItem('currentUser_name')
    },
    get UserId () {
      return window.sessionStorage.getItem('currentUser_id')
    },
    get UserImg () {
      return window.sessionStorage.getItem('currentUser_img')
    },
    get Token () {
      return window.sessionStorage.getItem('token')
    }
  }
}
const mutations = {
  setUser (state, data) {
    window.sessionStorage.setItem('currentUser_name', data.username)
    window.sessionStorage.setItem('currentUser_id', data.userid)
  },
  setUserImg (state, img) {
    window.sessionStorage.setItem('currentUser_img', img)
  },
  setToken (state, token) {
    window.sessionStorage.setItem('token', token)
  },
  clearUser () {
    window.sessionStorage.removeItem('currentUser_name')
    window.sessionStorage.removeItem('currentUser_id')
    window.sessionStorage.removeItem('currentUser_img')
    window.sessionStorage.removeItem('token')
  }
}
export default new Vuex.Store({
  state,
  mutations
})
