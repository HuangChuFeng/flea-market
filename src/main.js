import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource  from 'vue-resource'
import $ from 'jquery'
import Vuex from 'vuex'
import store from './vuex/store'
import './assets/css/bootstrap.min.css'  
import './assets/js/bootstrap.min'
import './assets/common.less'
import {myFun} from './assets/common.js'

// import axios from 'axios'
// import ah from 'ajax-hook'

Vue.prototype.myFun = myFun  //引入外部js文件
Vue.use(VueResource) 
let token = store.state.currentdata.Token;

// const ah = require("ajax-hook")
// ah.hookAjax({
// 	open:function(arg){
// 		console.log(arg)
// 	}
// })
// ah.unHookAjax()

//路由拦截，判断目标路由是否需要权限
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
    	myFun.showMsg('请登录');
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

//请求拦截，全局增加头部token信息
// Vue.http.interceptors.push((request, next) => {  
//   console.log('vue.http：'+token);
//   if(token) {  
//     request.headers.set('token',token);
//   }
//   next((response) => {  
//   	if(response.body.code === 401){ //与后台约定登录失效的返回码
//         parent.location.href ='/index';
//     }
//     return response;  
//   });  
// });



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	store,
  	el: '#app',
  	router,
  	template: '<App/>',
  	components: { App }
})
