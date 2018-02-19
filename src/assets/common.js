import router from '../router'
import store from '../vuex/store'
var myFun = {
	showMsg: function(text, type) {
		if(type == '1') {
			$('#msg').find('i').addClass('yes');
		} else {
			$('#msg').find('i').addClass('error')
		}
		$('#msg').find('span').text(text);
		$('#msg').fadeIn(500);
		setTimeout(function(){
			$('#msg').fadeOut(1000);
		},1000)
	},
	setToken: function(xhr) {
		var token = store.state.Token;
		if(token) {
			xhr.setRequestHeader("token", token);
		}
	},
	tokenExpired: function(error) {
		if (error.status == 400 && error.tokenError) {
		    this.showMsg('token过期');
		    setTimeout(function(){
			    store.commit('clearUser')
	    		router.go(0);
		    }, 1500);
		}
	}
}

export {
  myFun
}