<template>
	<div>
		<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		<!-- 登录 -->
			<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="myModalLabel">
					用户登录
				</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal form" v-show='showLoginForm'>
				  <div class="form-group">
				    <label for="inputEmail" class="col-sm-4 control-label">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</label>
				    <div><div class="col-sm-5">
				      <input type="email" class="form-control" id="inputEmail"
				      name="email" v-model.trim='email' @keyup="logInputBlur('email')" @blur="logInputBlur('email')" placeholder="邮箱">
				    </div><span class="notice"><i class="icon check" v-if="logLegal.email"></i>{{logNotice.email}}</span></div>
				  </div>
				  <div class="form-group">
				    <label for="inputPwd" class="col-sm-4 control-label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
				    <div><div class="col-sm-5">
				      <input type="password" class="form-control" id="inputPwd"
				      name="pwd" v-model.trim='pwd' @keyup="logInputBlur('pwd')" @blur="logInputBlur('pwd')" placeholder="密码">
				      </div><span class="notice"><i class="icon check" v-if="logLegal.pwd"></i>{{logNotice.pwd}}</span></div>
				  </div>
				  <div class="form-group extra-op">
				    	<span @click="forgetPwd">忘记密码</span> &nbsp;|&nbsp;
				    	<span @click="switch1(1)">注册</span>
				  </div>
				  <div class="form-group btn-box">
				    <div class="col-sm-offset-2 col-sm-8">
					  <button type="button" class="btn btn-cancel" data-dismiss="modal">取消
					  </button>
					  <span></span>
					  <button type="button" class="btn btn-submit" @click="login($data)" :disabled='logBtnDisable'>登录</button>
				    </div>
				  </div>
				  </form>
				<div class="forget-box" v-show="!showLoginForm">
					<p>请输入注册邮箱：</p>
					<input type='email' name="email" class="form-control" v-model='email'/>
					<p class="reset-success" v-show="resetSuccess"><span>重置密码成功！</span>1s后自动回到登录界面</p>
					<div class="btn-box">
						<button class="btn btn-cancel" @click="showLoginForm = true;">返 回</button>
						<span></span>
						<button class="btn btn-submit" @click="sendEamil">发送邮件</button>
					</div>
				</div>
			</div>
		</div><!-- /.modal-content -->
		</div><!-- /.modal -->
	</div>

	<div class="modal fade" id="regModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<!-- 注册 -->
			<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="myModalLabel">
					用户注册
				</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal form">
				 	<div class="form-group">
				    <label for="inputName" class="col-sm-4 control-label">用&nbsp; 户&nbsp;名：</label>
				    <div><div class="col-sm-5">
				      <input type="email" class="form-control" id="inputName" @blur="inputBlur('username')" @keyup = "inputBlur('username')"
				      name="username" v-model.trim='username' placeholder="用户名">
				    </div><span class="notice"><i class="icon check" v-if="legal.userName"></i>{{notice.userName}}</span></div>
				  </div>
				  <div class="form-group">
				    <label for="inputEmail" class="col-sm-4 control-label">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</label>
				    <div><div class="col-sm-5">
				      <input type="email" class="form-control" id="inputEmail" @blur="inputBlur('email')" @keyup = "inputBlur('email')"
				      name="email" v-model.trim='email' placeholder="邮箱">
				    </div><span class="notice"><i class="icon check" v-if="legal.email"></i>{{notice.email}}</span></div>
				  </div>
				  <div class="form-group">
				    <label for="inputPwd" class="col-sm-4 control-label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
				    <div><div class="col-sm-5">
				      <input type="password" class="form-control" id="inputEmail" @blur="inputBlur('pwd')" @keyup="inputBlur('pwd')"
				      name="pwd" v-model.trim='pwd' placeholder="密码">
				    </div><span class="notice"><i class="icon check" v-if="legal.pwd"></i>{{notice.pwd}}</span></div>
				  </div>
				  <div class="form-group">
				    <label for="inputRpwd" class="col-sm-4 control-label">重复密码：</label>
				    <div><div class="col-sm-5">
				      <input type="password" class="form-control" id="inputRpwd" @blur="inputBlur('rpwd')" @keyup="inputBlur('rpwd')"
				      v-model.trim='rpwd' placeholder="重复密码">
				    </div><span class="notice"><i class="icon check" v-if="legal.rpwd"></i>{{notice.rpwd}}</span></div>
				  </div>
				  <div class="form-group extra-op">
				    	<span @click='switch1(0)'>快速登录 ></span>
				  </div>
				  <div class="form-group btn-box">
				    <div class="col-sm-offset-2 col-sm-8">
					  <button type="button" class="btn btn-cancel" data-dismiss="modal">取消
					  </button>
					  <span></span>
					  <button type="button" class="btn btn-submit" @click="register" :disabled='regBtnDisable'>注册</button>
				    </div>
				  </div>
				  </form>
			</div>
		</div><!-- /.modal-content -->
		</div><!-- /.modal -->
	</div>
	</div>
</template>
<script>
export default {
	props: ["parentMsg"],
	data () {
	  return {
	  	username: '',
	  	userid: '',
	  	email: '',
	  	pwd: '',
	  	rpwd: '',
	  	childMsg: this.parentMsg,
	  	regBtnDisable: true, //注册按钮禁用
	  	logBtnDisable: true, //登录按钮禁用
	  	logLegal: {
	  		email: false,
	  		pwd: false
	  	},
	  	logNotice: {
	  		email: null,
	  		pwd: null
	  	},
	  	legal: {
	  		userName: false,
	  		email: false,
	  		pwd: false,
	  		rpwd: false
	  	},
	  	notice: {
	  		userName: null,
	  		email: null,
	  		pwd: null,
	  		rpwd: null
	  	},
	  	showLoginForm: true,    //是否显示登录表单
	  	resetSuccess: false
	  }
	},
	mounted: function () {
	},
	watch: {
	    parentMsg(val) {
	    	this.childMsg = val;
	    },
	    childLogMsg(val){
	    	this.$emit("parent-msg-change",val);
	    }
	},
	methods: {
		inputBlur(type) {
			switch(type){
				case 'username':
					if(this.username == '') {
						this.legal.userName = false;
						this.notice.userName = '用户名不能为空';
					} else {
						this.legal.userName = true;
						this.notice.userName = null;
					}
					break;
				case 'email':
					var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
					if(reg.test(this.email)) {
						var _this = this;
				  		$.ajax({
				            url: "/api/user/checkEmail",
				            type: "get",
				            data: {inputEmail: _this.email},
				            success: function(data){
			            		if(data.occupy) {
			            			_this.notice.email = '邮箱已被占用';
			            			_this.legal.email = false;
			            		} else {
			            			_this.legal.email = true;
			            			_this.notice.email = null;
			            		}
				            },
				            error: function(error) {
				            	console.log("获取资源失败");
				            }
				        });
					} else {
						this.notice.email = '邮箱格式错误';
						this.legal.email = false;
					}
					break;
				case 'pwd':
					if(this.pwd == '') {
						this.legal.pwd = false;
						this.notice.pwd = '密码不能为空';
					} else {
						this.legal.pwd = true;
						this.notice.pwd = null;
					}
					break;
				case 'rpwd':
					if(this.pwd !== this.rpwd) {
						this.legal.rpwd = false;
						this.notice.rpwd = '两次密码不一致';
					} else {
						this.legal.rpwd = true;
						this.notice.rpwd = null;
					}
					break;
			}
			if(this.legal.userName && this.legal.email && this.legal.pwd && this.legal.rpwd) {
				this.regBtnDisable = false;
			} else {
				this.regBtnDisable = true;
			}
		},
		logInputBlur(type) {
			switch(type){
				case 'email':
					if(this.email == '') {
						this.logLegal.email = false;
						this.logNotice.email = '邮箱不能为空';
					} else {
						var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
						if(reg.test(this.email)) {
							var _this = this;
					  		$.ajax({
					            url: "/api/user/checkEmail",
					            type: "get",
					            data: {inputEmail: _this.email},
					            success: function(data){
				            		if(data.occupy) {
				            			_this.logNotice.email = null;
				            			_this.logLegal.email = true;
				            			console.log(data.occupy)
				            		} else {
				            			_this.logNotice.email = '邮箱不存在';
				            			_this.logLegal.email = false;
				            		}
					            },
					            error: function(error) {
					            	console.log("获取资源失败");
					            }
					        });
						} else {
							this.logNotice.email = '邮箱格式错误';
							this.logLegal.email = false;
						}
					}
					break;
				case 'pwd':
					if(this.pwd == '') {
						this.logLegal.pwd = false;
						this.logNotice.pwd = '密码不能为空';
					} else {
						this.logLegal.pwd = true;
						this.logNotice.pwd = null;
					}
					break;
				}
				if(this.logLegal.email && this.logLegal.pwd) {
					this.logBtnDisable = false;
				} else {
					this.logBtnDisable = true;
				}
		},
		register() {
	      	this.$http.post('/api/user/register', {
		        username: this.username,
		        email: this.email,
		        pwd: this.pwd
		    },{}).then((response) => {
				$('.close').click();
				this.myFun.showMsg('注册成功', 1);
				this.email = '';
				this.pwd = '';
		    })
		    .catch(function(response) {
		        console.log("出现异常");
		    })
		},
		login(data) {
			this.$http.post('/api/user/login', {
		        email: data.email,
		        pwd: data.pwd
		    },{}).then((response) => {
					this.childMsg.isExit = false;
		            this.childMsg.username = response.body.userName;
		            this.childMsg.userimg = response.body.imgSrc;
		            this.$store.commit('setUser', response.body);
                	this.$store.commit('setUserImg', response.body.imgSrc);
		            this.$store.commit('setToken', response.body.token);
					$('.close').click();
					this.myFun.showMsg('登录成功', 1);
				    this.$router.go(0);
		        

		    })
		    .catch(function(response) {
		        console.log("异常");
		    })
		},
		switch1(type) {
			console.log(type)
			if(type == 1) {
				$('.close').click();
				$('#reg').click();
			} else {
				$('.close').click();
				$('#login').click();
			}
		},
		//忘记密码
		forgetPwd() {
			this.showLoginForm = false;
		},
		sendEamil() {
			this.$http.post('/api/user/sendEamil', {
		        email: this.email,
		    },{}).then((response) => {
				console.log(response.body)
				this.resetSuccess = true;
				var _this = this;
				setTimeout(function(){
					_this.showLoginForm = true;
				}, 1000)
		    })
		    .catch(function(response) {
		        console.log("异常");
		    })
		}
	}
}
</script>
<style lang='less'>

.extra-op {
	text-align: right;
	padding-right: 165px;
	span {
		color: rgba(240, 27, 45, 0.9);
		&:hover {
			cursor: pointer;
			color: rgb(240, 27, 45);
		}
	}
}

.modal-body {
	min-height: 250px;
	.notice {
		color: rgba(240, 27, 45, 0.9);
		font-size: 0.6rem;
		position: relative;
		right: 5%;
		top: 3px;
	}
	.check {
		background-image: url(../assets/img/check.png);
		margin: 0;
		margin-right: 10%;
	}
}

.forget-box {
	margin-top: 30px;
	p {
		text-align: left;
	}
	.reset-success {
		font-size: 0.8rem;
		margin-top: 15px;
		text-align: right;
		span {
			color: rgba(240, 27, 45, 0.9);
		}
	}
}
</style>