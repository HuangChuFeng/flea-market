<template>
	<div class="items">
		<div class="detail">
			<div class="item-left">
				<div class="big-img">
					<img :src='bigImg'>
				</div>
				<div class="small-img">
					<div v-for="(img,index) in item.imgPath">
						<img :src="img" @click = 'preview(index)' v-bind:class="{'img-active':index === imgActive}">
					</div>
				</div>
			</div>
			<div class="item-right">
				<h3>{{item.title}}</h3>
				<p class="price">￥ {{item.price}}</p>
				<p>{{item.level}} 成新<span class="hits">
					<img src="../assets/img/eye.png" />{{item.hits}}&nbsp;&nbsp;次</span></p>
				<p>来自 
					<span v-if="item.sellerId == userId">{{item.userName}}</span>
					<router-link :to="{path:'/message',query: {sellerId: item.sellerId, sellerName: encodeURI(encodeURI(item.userName))}}" v-else>
					{{item.userName}}</router-link>

				</p>
				<p>商家描述： {{item.description}}</p>
				<div class="btn-box">
					<button type="button" class="btn btn-cancel" @click="$router.go(-1)">返 回</button>
					<span></span>
					<button type="button" class="btn btn-submit" v-if="isCollect" @click='collect'>取消收藏</button>
					<button type="button" class="btn btn-submit" v-else @click='collect'>收 藏</button>
					<span></span>
					<button v-if="item.sellerId != userId" type="button" class="btn btn-submit" @click='buy'>入 手</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
	    	itemId: this.$route.query.id, 	// id
	    	item: {},
	    	bigImg: '',   //大图预览
	    	imgActive: 0,
	    	isCollect: this.$route.query.isCollect,
	    	userId: this.$store.state.UserId
	    }
	},
	created: function() {
	},
	mounted: function() {
		this.getItem();
	},
	methods: {
		preview(index) {
			var e = window.event;
			this.bigImg = e.target.src;
			this.imgActive = index;
		},
		getItem() {
			var _this = this;
			$.ajax({
				url: "/api/item/getItems",
				type: "get",
				data: {itemId: _this.itemId},
				success: function(data){
					for (var i = 0; i < data.length; i++) {
						var src = data[i].imgPath.split('&');
						for (var key in data[i]) {
							if(key == 'imgPath') {
								data[i][key] = src;
							}
						}
					}
					_this.item = data[0];
					_this.bigImg = _this.item.imgPath[0]
				},
				error: function(error) {
					console.log("获取失败");
				}
			});
		},
		collect() {
			var _this = this, token = this.$store.state.Token, type;
			if(!token){
				this.myFun.showMsg('您还没有登录', 0);
			} else {
			    if(this.isCollect) {    //取消收藏
			    	type = 0;
			    } else {
			    	type = 1;         //添加收藏
			    }
			    $.ajax({
			    	url: "/api/item/collect",
			    	type: "post",
			    	data: {itemId: this.itemId, type: type},
			    	beforeSend: function(xhr) {
			    		_this.myFun.setToken(xhr);
			    	},
			    	success: function(data){
			    		if( type == 0) {
			    			_this.isCollect = false;
			    			_this.myFun.showMsg('已取消收藏', 1)
			    		} else {
			    			_this.isCollect = true;
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
		//购买
		buy() {
			var token = this.$store.state.Token;
			if(!token){
				this.myFun.showMsg('您还没有登录', 0);
			} else {
				this.$http.post('/api/item/buy', {
					itemId: this.itemId,
					sellerId: this.item.sellerId
				},{}).then((response) => {
					if(response.body.exist) {
						this.myFun.showMsg('该订单已存在', 0);
					}
					if(response.body.msg == 200) {
						this.$router.push({ path: '/items/buyin' });
					}
				})
				.catch(function(response) {
					console.log("异常");
				})
			}
		}
	}
}
</script>

<style lang="less"> 
	.detail {
		display: flex;
	}
	.item-left {
		min-width: 28.125rem;
		.big-img {
			height: 25rem;
			border: 1px solid #eee;
			padding: 0.3125rem;
			img {
				max-width: 100%;
				max-height: 100%;
			}

		}
		.small-img {
			border: 1px solid;
			display: flex;
			justify-content: center;
			margin: 0;
			padding: 3px;
			div {
				width: 100px;
				height: 100px;
				margin: 0.3125rem;
				background-color: #fff;
				img {
					max-width: 100%;
					max-height: 100%;
					opacity: 0.6;
					&:hover {
						cursor: pointer;
					}
				}
				.img-active {
					opacity: 1;
				}
			}
		}
	}
	.item-right {
		color: #eee;
		margin-left: 4.375rem;
		text-align: left;
		min-width: 12.5rem;
		h3 {
			margin-bottom: 1.875rem;
		}
		.price {
			color: red;
		}
		.hits {
			float: right;
		}
	}
	@media screen and (max-width:600px){
		.detail {
			display: block;
		}
		.item-left {
			width: 22rem;
			margin: 0 auto;
		}
		.item-right {
			color: #eee;
		// margin-left: 4.375rem;
		text-align: left;
		min-width: 12.5rem;
		h3 {
			margin-bottom: 1.875rem;
		}
		.price {
			color: red;
		}
		.hits {
			float: right;
			margin-right: 40px;
		}
	}
}
</style>