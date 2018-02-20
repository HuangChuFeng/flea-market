<template>
	<div class="">
		<!-- 选择商品类型 -->
		<div class="select-type">
			<p @click="toggleAside"><i>&lt;</i><span>宝贝类型</span></p>
			<ul @click="selectType">
				<li>全部</li>
				<li>书籍教材</li>
				<li>生活用品</li>
				<li>衣物</li>
				<li>化妆洗护</li>
				<li>交通工具</li>
				<li>体育用品</li>
			</ul>
		</div>
		<div class="items">
			<!-- 搜索框 -->
			<div class="search">
				<i class="icon search-icon"></i>
				<input type="text" name='search' v-model="key" @keyup.enter="search">
			</div>
			<div class="items-box">
				<!-- 商品列表 -->
				<div class="item-list box-shadow" v-for="item in items">
					<div class="img">
						<img v-bind:data-src="item.imgPath" src="../assets/img/loading.gif" alt="">
						<div class="no-img" v-if="item.imgPath == ''">
							<img src="../assets/img/notice.png">
							<br/><br/>
							<span>商家没有上传图片</span>
						</div>
					</div>
					<div class="img-cover">
						<div class="operate">
							<i class="collect icon" @click="collect(item.id)" v-bind:class="{'collected': collectArr != undefined && collectArr.indexOf(item.id+'') >= 0}"></i>
						</div>
					</div>
					<p class="title">
						<router-link :to="{path:'/index/detail',query: {id: item.id, isCollect: collectArr != undefined && collectArr.indexOf(item.id+'') >= 0 ? true : false}}">{{item.title}}</router-link>
						<span>{{item.level}} 成新</span>
					</p>
					<p class="price">￥ {{item.price}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
    	items: [], //商品信息
    	itemsCopyArr: [],
    	collectArr: [],
    	isAside: false,
    	key: null
    }
},
mounted: function(){
	this.getItems();
	var imgBox = document.getElementsByClassName('img');
	for (let i = 0; i < 7; i++) {
		setTimeout(() => {
			var img = imgBox[i].getElementsByTagName('img')[0];
			var src = img.dataset.src;
			img.setAttribute("src", src)
		}, 1000)
	}
	window.addEventListener('scroll', this.myScroll);
},
methods: {
	getItems() {
		var _this = this;
		$.ajax({
			url: "/api/item/getItems",
			type: "get",
			data: { getAll: true },
			async: false,
			beforeSend: function(xhr) {
				_this.myFun.setToken(xhr);
			},
			success: function(data){
				var itemsCopy = data.items;
				for (var i = 0; i < itemsCopy.length; i++) {
					var src = itemsCopy[i].imgPath.split('&')[0].substring(1);
					for (var key in itemsCopy[i]) {
						if(key == 'imgPath') {
							itemsCopy[i][key] = src;
						}
					}
				}
				_this.items = itemsCopy;
				_this.itemsCopyArr = _this.items;
				if(data.collect){
					_this.collectArr = data.collect;
				}
			},
			error: function(error) {
				_this.myFun.tokenExpired(error)
			}
		});
	},
	collect(id) {
		if(!this.$store.state.Token) {
			this.myFun.showMsg('您还没有登录', 0)
		} else {
			var _this = this, index = this.collectArr.indexOf(id+''), type;
        if(index >= 0) {    //取消收藏
        	type = 0;
        } else {
          type = 1;         //添加收藏
      }
      $.ajax({
      	url: "/api/item/collect",
      	type: "post",
      	data: {itemId: id, type: type},
      	beforeSend: function(xhr) {
      		_this.myFun.setToken(xhr);
      	},
      	success: function(data){
      		if( type == 0) {
      			_this.collectArr.splice(index, 1);
      			_this.myFun.showMsg('已取消收藏', 1)
      		} else {
      			_this.collectArr.push(id+'');
      			_this.myFun.showMsg('收藏成功', 1)
      		}
      	},
      	error: function(error) {
      		console.log("收藏操作失败");
      		_this.myFun.tokenExpired(error)
      	}
      });
    }
},
myScroll(e) {
	var top1 = document.documentElement.scrollTop || document.body.scrollTop;
	// 显示或隐藏回到顶部按钮
	setTimeout(function() {
		var top2 = document.documentElement.scrollTop || document.body.scrollTop;
		if(top2 - top1 > 50) {
			$('.search').css('display','none')
		} 
		if(top2 - top1 < -50) {
			$('.search').css('display','block')
		}
	}, 1000);
	// 加载图片
	var imgBox = document.getElementsByClassName('img');
	var se = document.documentElement.clientHeight //浏览器可见区域高度。
	for (let i = 0; i < imgBox.length; i++) {
		setTimeout(() => {
			var img = imgBox[i].getElementsByTagName('img')[0];
			var top = img.getBoundingClientRect().top //元素顶端到可见区域顶端的距离
			if(top <= se){
				var src = img.dataset.src;
				img.setAttribute("src", src)
			}
		}, 1000)
	}
},
selectType(e) {
	var e = e || window.event;
	var allType = this.itemsCopyArr;
	var target = e.target || e.srcElement;
	if(target.nodeName.toLowerCase() == 'li'){
		var tempArr = [];
		if(target.innerHTML == '全部') {
			tempArr = allType;
		} else {
			for (let i = 0; i < this.itemsCopyArr.length; i++) {
				if(this.itemsCopyArr[i].type == target.innerHTML) {
					tempArr.push(this.itemsCopyArr[i]);
				}
			}
		}
		this.items = tempArr;
	}
},
toggleAside() {
	var li = $('.select-type li');
	let i = 0;
	if (!this.isAside) {
		setInterval(function() {
			$(li[i]).animate({'right': '0'});
			i += 1;
		},50);
		this.isAside = true;
	} else {
		setInterval(function() {
			$(li[i]).animate({'right': '-150px'});
			i += 1;
		},50)
		this.isAside = false;
	}
},
search() {
	var _this = this;
	$.ajax({
		url: "/api/item/search",
		type: "get",
		data: {key: this.key},
		success: function(data){
			var itemsCopy = data.items;
			if(itemsCopy == 0) {
				_this.myFun.showMsg('还没有您想要的宝贝', 0)
			} else {
				for (var i = 0; i < itemsCopy.length; i++) {
					var src = itemsCopy[i].imgPath.split('&')[0].substring(1);
					for (var key in itemsCopy[i]) {
						if(key == 'imgPath') {
							itemsCopy[i][key] = src;
						}
					}
				}
				_this.items = itemsCopy;
			}
			_this.key = null;
		},
		error: function(error) {
			console.log("获取失败");
		}
	})
}
}
}
</script>

<style lang="less">
	.items {
  // margin-top: 50%;
}
.select-type {
	position: fixed;
	right: 0px;
	top: 20%;
	text-align: left;
	overflow: hidden;
	z-index: 1;
	width: 105px;
	p {
		position: relative;
		display: block;
		height: 30px;
    	padding-left: 10px; 
		line-height: 30px;
		left: 75px;
		margin: 0;
		border-top-left-radius: 1rem;
		border-bottom-left-radius: 1rem;
		background: rgba(240, 27, 45, 1);
		transition: all ease .3s;
		&:hover {
			cursor: pointer;
			border-radius: 0;
			left: 0;
		}
		i {
			font-size: 26px;
			color: #eee;
		}
		span {
			color: #eee;
			display: inline-block;
			position: relative;
			left: 10px;
			bottom: 3px;
		}
	}
	ul {
		margin: 0;
		height: auto;
		padding: 0;
		text-align: center;
		li {
			line-height: 2.5rem;
			padding: 0 20px;
			position: relative;
			right: -180px;
			background: rgba(255, 255, 255, .8);
			transition: background ease .5s;
			&:hover {
				cursor: pointer;
				background-color: rgba(240, 27, 45, 0.9);
				color: #eee;
			}
		}
	}
}
.search {
	width: 70%;
	height: 32px;
	position: fixed;
	top: 10px;
	border-radius: 20px;
	background-color: rgba(255, 255, 255, 0.9);
	.search-icon {
		float: left;
		position: relative;
		margin: 0;
		right: -15px;
		top: 6px;
	}
	input {
		width: 90%;
		background: none;
		color: #333;
		float: left;
		margin: 0 20px;
		border: none;
		padding: 0 10px;
		border-bottom: 1px solid #ccc;
		transition: all ease .5s;
		outline: none;
		position: relative;
		top: 3px;
		&:focus {
			border-bottom: 1px solid rgba(240, 27, 45, 0.9);
		}
	}
}
@media screen and (max-width:960px){
	.search {
		input {
			width: 70%;
		}
	}
}
@media screen and (max-width:600px){
	.search {
		margin-left: 40px;
	}
}
.items-box {
	margin-top: 2.5rem;
}
</style>