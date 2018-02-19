import $ from 'jquery'
import jquery from 'jquery'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource  from 'vue-resource'
import Vuex from 'vuex'
import store from './vuex/store'
import './assets/css/bootstrap.min.css'  
import './assets/js/bootstrap.min'
import './assets/common.less'
import {myFun} from './assets/common.js'
import io from 'socket.io-client'

Vue.prototype.myFun = myFun;  //引入外部js文件
let token = store.state.Token;
var UserName = store.state.UserName;
//建立socket连接
// global.socket = io('http://39.107.80.119:3000');
global.socket = io('http://localhost:3000');
if(token) {
  global.socket.emit('comming in', {
    userName: UserName
  });
  global.socket.on('in', function(data) {
    console.log(data)
  })
  //接收消息
  global.socket.on('to'+UserName, function (data, fn) {
      fn('sendSuccess');
      myFun.showMsg('您有来自'+data.from+'的新消息', 0);
      console.log('您有来自'+data.from+'的新消息');

  });
}
Vue.use(VueResource) 
global.firstIn = false;
//路由拦截，判断目标路由是否需要权限
router.beforeEach((to, from, next) => {
  if(from.path == '\/' && to.path == '\/index') {
    global.firstIn = true;
  } else {
    global.firstIn = false;
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      myFun.showMsg('请登录', 0);
      setTimeout(function(){
          $('#login').click();
    },1500)
    } else {
      next()
    }
  } else {
    next()
  }
})

//全局设置token
Vue.http.interceptors.push((request, next) => {  
  if(token) {  
    request.headers.set('token',token);
  }
  next((error) => {  
    myFun.tokenExpired(error);
    return error;  
  });  
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
    el: '#app',
    router,
  	template: '<App/>',
  	components: { App }
})
