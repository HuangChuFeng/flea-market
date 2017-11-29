import router from '../router'
import store from '../vuex/store'
var myFun = {
	showMsg: function(text) {
		$('#msg').find('span').text(text);
		$('#msg').fadeIn(2500);
		setTimeout(function(){
			$('#msg').fadeOut(500);
		},500)
	},
	setToken: function(xhr) {
		var token = store.state.currentdata.Token;
		if(token) {
			xhr.setRequestHeader("token", token);
		}
	},
	tokenExpired: function(error) {
	    if(error.status == 400) {
		    this.showMsg('token过期');
		    setTimeout(function(){
			    store.commit('clearUser')
	    		router.go(0)
		    }, 1500)
		}
	}
}

export {
  myFun
}