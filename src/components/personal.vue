<template>
	<div>
		<header>
		   <span>{{this.$store.state.UserName}}</span><i class="edit icon" @click="slideInfoBox"></i>
		</header>
		<div class="info-box">
			<div class="op-box"> 
				<div class="operate-box">
					<div class="chang-pwd"></div>
					<button class="" @click="changeAccount">填写支付帐号</button>
				</div>
				<div class="operate-box">
			      	<div class="img">
			      		<img :src="src"/>
			      	</div>
			      	<label><input type="file" id="portrait" name="portrait" @change="changePortrait">更换头像</label>
			    </div> 
				<div class="operate-box">
					<div class="chang-pwd"></div>
					<button class="" @click="changePwd">修改密码</button>
				</div>
			</div>
			<div class="op-content" v-if="isChangeAccount">
			<form class="form-horizontal form">
				  <div class="form-group">
				    <label for="inputRpwd" class="col-sm-4 control-label">支付帐号：</label>
				    <div class="col-sm-4">
				      <input type="text" class="form-control" name="inputAccount"
				      v-model.trim='inputAccount' placeholder='支付帐号'>
				    </div>
				  </div>
				  <div class="form-group btn-box">
				    <div class="col-sm-offset-2 col-sm-8">
				      <button type="button" class="btn btn-cancel" @click='cancel'>取消
					  </button>
					  <span></span>
					  <button type="button" class="btn btn-submit" @click="insertAccount">提交</button>
				    </div>
				  </div>
				  </form>
			</div>
			<div class="op-content" v-if="isChangeImg">
				<img :src="newSrc" ><br/>
					<div class="btn-box">
						<button type="button" class="btn btn-cancel" @click='cancel'>取消
					  </button>
					  <span></span>
					  <button type="button" class="btn btn-submit" @click="modifyImg">提交</button>
					</div>
			</div>
			<div class="op-content" v-if="isChangePwd">
				<form class="form-horizontal form">
				  <div class="form-group">
				    <label for="inputPwd" class="col-sm-4 control-label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
				    <div class="col-sm-4">
				      <input type="password" class="form-control" id="inputEmail"
				      name="pwd" v-model.trim='pwd' placeholder="密码">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="inputRpwd" class="col-sm-4 control-label">重复密码：</label>
				    <div class="col-sm-4">
				      <input type="password" class="form-control" id="inputRpwd"
				      v-model.trim='rpwd' placeholder="重复密码">
				    </div>
				  </div>
				  <div class="form-group btn-box">
				    <div class="col-sm-offset-2 col-sm-8">
				      <button type="button" class="btn btn-cancel" @click='cancel'>取消
					  </button>
					  <span></span>
					  <button type="button" class="btn btn-submit" @click="modifyPwd">提交</button>
				    </div>
				  </div>
				  </form>
			</div>
		</div>
		<div id="item-charts"></div>
	</div>
	
</template>
<script>
import echarts from 'echarts/dist/echarts.min.js';
export default {
  data () {
    return {
    	newSrc: '',   //新头像图片src
    	src: this.$store.state.UserImg,      //上传成功后更新头像src
    	newImg: '',   //上传的图片
    	isChangeImg: false,
    	isChangePwd: false,
    	isChangeAccount: false,
    	inputAccount: null,
    	pwd: '',
    	rpwd: '',
    	option: {
    		title : {
		        text: '各类商品占比',
		        x:'center',
		        textStyle: {
                    fontWeight: 'normal',              //标题颜色
                    color: '#eee'
                },
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        textStyle: {
                    color: '#eee'
                },
		        data: ['发布商品','收藏商品','买入商品','售出商品']
		    },
		    series : [
		        {
		            name: '各类商品占比',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:[
		                {value:0, name:'发布商品'},
		                {value:0, name:'收藏商品'},
		                {value:0, name:'买入商品'},
		                {value:0, name:'售出商品'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
    	}
    }
  },
  mounted: function() {
  	var myChart = echarts.init(document.getElementById('item-charts'));
  	var _this = this;
  	$.ajax({
	    url: "/api/user/echartsInit",
	    type: "get",
        beforeSend: function(xhr) {
          _this.myFun.setToken(xhr);
        },
	    success: function(data){
	    	var option = _this.option.series[0].data;
	    	for (var i = 0; i < option.length; i++) {
	    		option[i].value = data[i];
	    	}
  			myChart.setOption(_this.option);
  			window.onresize = myChart.resize();
	    },
	    error: function(err) {
	    	console.log('获取资源失败')
            _this.myFun.tokenExpired(err)
	    }
	})
			            
  },
  methods: {
  	slideInfoBox() {
  		$('.info-box').slideToggle();
  	},
  	changePortrait(e) {
  		this.isChangeImg = true;
  		this.isChangePwd = false;
  		var files = e.target.files || e.dataTransfer.files;
  		this.newImg = files[0];
  		if(typeof FileReader==='undefined'){
            alert('您的浏览器不支持图片上传，请升级您的浏览器');
            return false;
        }
        var vm = this;
        var leng = files.length;
        for(var i = 0; i < leng; i++){
            var reader = new FileReader();
            reader.readAsDataURL(files[i]); 
            reader.onload = function(e) {
            	vm.newSrc = e.target.result;
            };                 
        }
  	},
  	changePwd() {
  		this.isChangePwd = true;
  		this.isChangeImg = false;
  	},
  	modifyPwd() {
  		if(this.pwd != this.rpwd) {
  			this.myFun.showMsg('两次密码不一致', 0);
  		} else if(this.pwd == '' || this.rpwd == '') {
  			this.myFun.showMsg('密码不能为空', 0);
  		} else {
  			this.$http.post('/api/user/modifyInfo', {
  				newPwd: this.rpwd,
  				token: this.$store.state.Token
		    },{}).then((response) => {
		    	if(response.code = 200){
			    	this.myFun.showMsg('密码修改成功', 1)
					this.isChangePwd = false;
				}
		    })
		    .catch(function(response) {
		        console.log("出现异常");
		    })
  		}
  	},
  	modifyImg() {
  		var formdata = new FormData();  		
		formdata.enctype = "multipart/form-data";
		formdata.append('newImg', this.newImg);
		formdata.append('token', this.$store.state.Token)
		var _this = this;
		$.ajax({
            url: "/api/user/modifyInfo",
            type: "post",
            data: formdata,
            processData: false, // 不处理数据
            contentType: false, // 不设置请求头
            cache: false,
            success: function(data){
                if(data.imgSrc) {
                	console.log('上传成功')
                	_this.myFun.showMsg('上传头像成功', 1)
                	_this.src = _this.newSrc;
                	_this.$store.commit('setUserImg', data.imgSrc);
                	$('#nav_portrait').attr("src",data.imgSrc);
                	_this.isChangeImg = false;
                }
                
            },
            error: function(error) {
            	console.log(error)
            	_this.myFun.showMsg("上传头像失败", 0);
            }
        })
  	},
  	changeAccount () {
  		this.isChangeAccount = true;
  	},
  	insertAccount() {
  		console.log(this.inputAccount)
  		this.$http.post('/api/user/insertAccount', {
				account: this.inputAccount
		    },{}).then((response) => {
		    	this.inputAccount = null;
				this.myFun.showMsg('填写支付帐号成功', 1)
				this.isChangeAccount = false;
		    })
		    .catch(function(response) {
		        console.log("异常");
		    })
  	},
  	cancel() {
  		this.isChangePwd = false;
  		this.isChangeImg = false;
  		this.isChangeAccount = false;
  	}
  }
}
</script>
<style lang="less"> 
header {
	width: 100%;
	height: 30px;
	margin-bottom: 30px;
	color: #eee;
	span {
	  	display: inline-block;
	    position: relative;
	    bottom: 7px;
	    margin-left: 10px;
	    font-size: 20px;
	}
}
.info-box{
	display: none;
}
.op-box {
	width: 100%;
	height: 180px;
	background: #eee;
	display: flex;
	justify-content: center;
	.operate-box {
	   width: 140px;
	   height: 120px;
	   border: 1px solid #ccc;
	   margin: 15px;
	   .img {
	   	width: 100%;
	   	height: 120px;
	   }
	   img {
	     max-width: 100%;
	     max-height: 100%;
	     &:hover{
	       cursor: pointer;
	     }
	  }
	  label, button {
	  	display: block;
	  	width: 140px;
	  	line-height: 30px;
		color: #fff;
		font-weight: normal;
	  	background: rgba(240, 27, 45, 0.9);
	  	&:hover {
	  		cursor: pointer;
	  		background: rgb(240, 27, 45);
	  	}
	  	input {
	  		display: none;
	  	}
	  }
	  button {
	  	margin-top: -1px;
	  }
	}
}
	.chang-pwd {
		height: 120px;
		background-image: url(../assets/img/change-pwd.png);
		background-repeat: no-repeat;
		background-position: center center;
	}
.op-content {
	margin-bottom: 30px;
	width: 100%;
	min-height: 300px;
	padding: 20px 0;
	background: #eee;
	img {
		width: 250px;
		max-height: 100%;
	}
}
#item-charts {
	width: 600px;
	height: 400px;
	margin: 0 auto;
	border: 0;
}
</style>