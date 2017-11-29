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
				<form class="form-horizontal form">
				  <div class="form-group">
				    <label for="inputEmail" class="col-sm-4 control-label">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</label>
				    <div class="col-sm-5">
				      <input type="email" class="form-control" id="inputEmail"
				      name="email" v-model.trim='email' placeholder="邮箱">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="inputPwd" class="col-sm-4 control-label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
				    <div class="col-sm-5">
				      <input type="password" class="form-control" id="inputPwd"
				      name="pwd" v-model.trim='pwd' placeholder="密码">
				    </div>
				  </div>
				  <div class="form-group extra-op">
				    	<span>忘记密码</span> &nbsp;|&nbsp;
				    	<span @click="switch1(1)">注册</span>
				  </div>
				  <div class="form-group btn-box">
				    <div class="col-sm-offset-2 col-sm-8">
					  <button type="button" class="btn btn-cancel" data-dismiss="modal">取消
					  </button>
					  <span></span>
					  <button type="button" class="btn btn-submit" @click="login($data)">登录</button>
				    </div>
				  </div>
				  </form>
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
				    <div class="col-sm-5">
				      <input type="email" class="form-control" id="inputName" @blur = "inputBlur('username')"
				      name="username" v-model.trim='username' placeholder="用户名">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="inputEmail" class="col-sm-4 control-label">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</label>
				    <div class="col-sm-5">
				      <input type="email" class="form-control" id="inputEmail" @blur = "inputBlur('email')"
				      name="email" v-model.trim='email' placeholder="邮箱">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="inputPwd" class="col-sm-4 control-label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
				    <div class="col-sm-5">
				      <input type="password" class="form-control" id="inputEmail" @blur="inputBlur('pwd')"
				      name="pwd" v-model.trim='pwd' placeholder="密码">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="inputRpwd" class="col-sm-4 control-label">重复密码：</label>
				    <div class="col-sm-5">
				      <input type="password" class="form-control" id="inputRpwd" @blur="inputBlur('rpwd')"
				      v-model.trim='rpwd' placeholder="重复密码">
				    </div>
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
	  	email: 'sss@qq.com',
	  	pwd: 'sss',
	  	rpwd: '',
	  	childMsg: this.parentMsg,
	  	regBtnDisable: true,
	  	legal: {
	  		userName: false,
	  		email: false,
	  		pwd: false,
	  		rpwd: false
	  	}
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
						console.log('用户名不能为空')
					} else {
						this.legal.userName = true;
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
			            			console.log('邮箱已被占用')
			            			_this.legal.email = false;
			            		} else {
			            			console.log('邮箱可以使用')
			            			_this.legal.email = true;
			            		}
				            },
				            error: function(error) {
				            	console.log("获取资源失败");
				            }
				        });
					} else {
						console.log('邮箱格式错误')
						this.legal.email = false;
					}
					break;
				case 'pwd':
					if(this.pwd == '') {
						this.legal.pwd = false;
						console.log('密码不能为空')
					} else {
						this.legal.pwd = true;
					}
					break;
				case 'rpwd':
					if(this.pwd !== this.rpwd) {
						this.legal.rpwd = false;
						console.log('两次密码不一致')
					} else {
						this.legal.rpwd = true;
					}
					break;
			}
			if(this.legal.userName && this.legal.email && this.legal.pwd && this.legal.rpwd) {
				this.regBtnDisable = false;
			} else {
				this.regBtnDisable = true;
			}
		},
		register() {
	      	this.$http.post('/api/user/register', {
		        username: this.username,
		        email: this.email,
		        pwd: this.pwd
		    },{}).then((response) => {
				$('.close').click();
				this.myFun.showMsg('注册成功');
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
		    	console.log(response)
				if (response.body.userId) {
					this.childMsg.isExit = false;
		            this.childMsg.username = response.body.userName;
		            this.childMsg.userimg = response.body.imgSrc;
		            this.username = response.body.userName;
		            this.userid = response.body.userId;

		            this.$store.commit('setUser', data);
		            this.$store.commit('setUserImg', this.childMsg.userimg);
		            this.$store.commit('setToken', response.body.token);
					$('.close').click();
					this.myFun.showMsg('登录成功');
				    this.$router.go(0);
		        } else {
		            console.log(response.body);
		        }

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
}

</style>