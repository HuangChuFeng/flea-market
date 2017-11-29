<template>
	<div class="edit-item">
			<form class="form-horizontal form" id="addForm">
				  <div class="form-group">
				    <label class="col-sm-1 control-label">宝贝标题：</label>
				    <div class="col-sm-5">
				      <input type="text" class="form-control" v-model='item.title' placeholder="标题">
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-1 control-label">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</label>
				    <div class="col-sm-5">
				      <select class="form-control" v-model="item.type">
				      	    <option v-for="option in options" v-bind:value="option.value">
     				 			{{ option.text }}
   						  	</option>
						</select>
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-1 control-label">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格：</label>
				    <div class="col-sm-5">
				      <input type="text" class="form-control" v-model='item.price' placeholder="价格">
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-1 control-label">新旧程度：</label>
				    <div class="col-sm-5">
				      <input type="text" class="form-control" v-model='item.level' placeholder="新旧程度"/>  
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-1 control-label">描&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;述：</label>
				    <div class="col-sm-5">
				      <textarea class="form-control" rows="6" v-model='item.description' placeholder="写下宝贝的故事吧......"></textarea>
				    </div>
				  </div>
				  <div class="img-box">
				  	<div class="add-img" v-if="item.imgPath.length < 4">
					  	<label>
					  		<input type="file" ref="imgPath" name="img[]" @change='addImg'/>
					  	</label>
				  	</div>
				  	<div class="img box-shadow" v-for="(url,index) in item.imgPath">
				  		<span @click = 'delImage(index)'>&times;</span>
				  		<div class="img-wrap">
				  			<img :src="url">
				  		</div>
				  	</div>
				  </div>
				  <div class="form-group btn-box">
				    <div class="col-sm-offset-2 col-sm-8">
					  <button type="button" class="btn btn-cancel" @click='cancelAdd'>取消
					  </button>
					  <span></span>
					  <button type="button" class="btn btn-submit" @click="publish">发布</button>
				    </div>
				  </div>
				</form>
		</div>
</template>
<script>

export default {
	props: ["opType"],
  data () {
    return {
    	childOpType: this.opType,
    	moduleTitle: ['在售宝贝', '我的买入', '我的卖出'],
    	moduleIndex: '',           // 点击的筛选条件下标
    	imgs: [],                  // 图片路径
	    options: [                 //商品类型
	      { text: '书籍教材', value: '书籍教材' },
	      { text: '生活用品', value: '生活用品' },
	      { text: '交通工具', value: '交通工具' },
	      { text: '体育用品', value: '体育用品' }
	    ],
    	item: {
    		title: '',		       // 标题
    		type: '书籍教材',      // 类型
    		imgPath: [],
    		price: 0,		       // 价格
    		description: '',       // 描述
    		level: 0,             // 新旧程度

    	}
    }
  },
  watch: {
	    opType(val) {
	    	this.childOpType = val;
	    	console.log('子组件：'+this.childOpType);
	    	if(val != 'add') {
	    		var _this = this;
		  		$.ajax({
		            url: "/api/item/getItems",
		            type: "get",
		            data: {itemId: val},
		            beforeSend: function(xhr) {
		              _this.myFun.setToken(xhr);
		            },
		            success: function(data){
					  	var src = data[0].imgPath.split('&');
					  	for (var j = 0; j < src.length; j++) {
					  		src[j] = src[j].substring(1);
					  	}
					  	data[0].imgPath = src;
						_this.item = data[0];
		            },
		            error: function(error) {
                		_this.myFun.tokenExpired(error)
		            	console.log("获取资源失败");
		            }
		        });
	    	}
	    },
	    childMsg(val){
	    	this.$emit("childMethod",val);
	    }
	},
  methods: {
  	cancelAdd() {
  		if(this.childOpType != 'add') {
            this.item.imgPath.length = 0;
            this.imgs.length = 0;
            this.item.title = '';
            this.item.type = '书籍教材';
		   	this.item.price= 0;
		   	this.item.description =  '';
		   	this.item.level= 0;
  		}
  		$('.items').animate({"left":"20px"});
  		$('.edit-item').animate({"left": "1500px"})
  		this.$emit("childMethod", '');
  	},
  	addImg(e) {
  		var files = e.target.files || e.dataTransfer.files;
  		// console.log(this.$refs.imgPath.files[0])
  		this.imgs.push(files[0])

	  	if (!files.length) return; 
        this.createImage(files);
  	},
  	delImage:function(index){
        this.item.imgPath.shift(index);
        this.imgs.shift(index)
    },
  	createImage(file) {
        if(typeof FileReader==='undefined'){
            alert('您的浏览器不支持图片上传，请升级您的浏览器');
            return false;
        }
        var vm = this;
        var leng = file.length;
        for(var i = 0; i < leng; i++){
            var reader = new FileReader();
            reader.readAsDataURL(file[i]); 
            reader.onload = function(e) {
            	vm.item.imgPath.push(e.target.result);
            };                 
        }
    },
    uploadImg() {
  		var _this = this;
    },
  	publish() {
		var formdata = new FormData();  		
		formdata.enctype = "multipart/form-data";
		if(this.childOpType != 'add'){   //修改
			console.log('类型：'+this.childOpType)
			formdata.append('itemId', this.childOpType);
		}
		if(this.imgs.length != 0){
			for (var i = 0; i < this.imgs.length; i++) {  
				formdata.append('img'+i, this.imgs[i]);
			}
		}else {
			this.myFun.showMsg('请添加图片')
		}
		formdata.append('token', this.$store.state.currentdata.Token);
  		for (var key in this.item) {  
		    if (key) {
		     	formdata.append(key, this.item[key])
		    }
		}
		var _this = this;
		$.ajax({
            url: "/api/item/publish",
            type: "post",
            data: formdata,
            processData: false, // 不处理数据
            contentType: false, // 不设置请求头
            cache: false,
            beforeSend: function(){
        		var date = new Date();
        		console.log('开始上传图片'+date);
    		},
            success: function(data){
                if(data.msg == '200'){
	                var date = new Date();
	        		console.log('上传完成'+date);
					_this.cancelAdd();
                	_this.item.imgPath.length = 0;
                	_this.imgs.length = 0;
                	_this.item.title = '';
                	_this.item.type = '书籍教材';
    				_this.item.price= 0;
    				_this.item.description =  '';
    				_this.item.level= 0;
                }
            },
            error: function(error) {
                _this.myFun.tokenExpired(error)
            	console.log("发布失败");
            }
        })
  	}
  }
}
</script>

<style lang="less"> 
.edit-item {
	min-height: 500px;
	position: absolute;
	left: 1500px;
	right: 30px;
	form {
		margin-left: 30px;
	}
}
.sell-items {
}	
.img-box{
	width: 90%;
	margin-left: 75px;
	text-align: left;
	min-height: 200px;
	display: flex;
	overflow: hidden;
	// border: 1px solid;
	justify-content: space-around;
	flex-wrap: wrap;
	.img {
		order: -1;
		width: 160px;
		height: 160px;
		margin-bottom: 5px;
		background-color: rgba(255, 255, 255, 0.6);
		text-align: center;
		&:hover {
			background-color: #fff;
		}
		&:hover span{
			visibility: visible;
		}
		.img-wrap {
			width: 160px;
			height: 120px;
			position: relative;
			bottom: 15px;
	          img {
	            max-width: 100%;
	            max-height: 100%;
	          }
		}
		span {
			position: relative;
		    left: 65px;
		    font-size: 30px;
		    top: -5px;
		    z-index: 3;
		    visibility: hidden;
		    &:hover {
		    	cursor: pointer;
		    }
		}
	}
	.add-img{
		width: 160px;
		height: 160px;
		border: 1px dashed;
		label {
			width: 160px;
			height: 160px;
			margin: 0;
			background-image: url(../assets/img/add-img.png);
			opacity:0.3;
			filter:"alpha(opacity=30)";
		 	-ms-filter:"alpha(opacity=30)"; /* 旧版IE */
			background-repeat: no-repeat;
			background-position: center center;
			&:hover {
				cursor: pointer;
			}
	    	input[type='file'] {
	    		display: none;
	    	}
	    }
	}
}
@media screen and (min-width: 1200px) {
	.img-box{
		width: 410px;
		height: 350px;
		margin-left: -40px;
		position: absolute;
		bottom: 125px;
		left: 605px;
	}
	.btn-box {
		margin-top: 70px;
	}
	form {
		margin-left: 0px;
	}
}
</style>