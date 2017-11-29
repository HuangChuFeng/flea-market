<template>
<div>
	<EditItem v-on:childMethod="getItems" :opType="opType"></EditItem>
		
	<div class="items">
			<div class="items-box">
				<div class="item-list box-shadow" v-for="item in items">
						<div class="img">
							<img v-bind:src="item.imgPath" alt="">
							<div class="no-img" v-if="item.imgPath == ''">
								<img src="../assets/img/notice.png">
								<br/><br/>
								<span>商家没有上传图片</span>
							</div>
						</div>
						<div class="img-cover">
							<div class="operate">
								<i class="edit icon" @click='modify(item.id)'></i>
								<i class="del icon" @click="del(item.id)"></i>
							</div>
						</div>
						<p class="title">
						<router-link :to="{path:'/index/detail',query: {id: item.id, isCollect: false}}">{{item.title}}</router-link>
						<span>{{item.level}} 成新</span></p>
						<p class="price">￥ {{item.price}}</p>
				</div>
				<div class="item-list add-btn" @click="addItem"></div>
			</div>
	</div>
	</div>
</template>

<script>
import EditItem from '@/components/editItem';
export default {
	components: { 
		EditItem
	},
  data () {
    return {
    	items: [],
    	opType: ''         //传入addItem子组件的信息，为数字的时候为修改，数字表示商品的id，add增加
    }
  },
  created: function() {
  	this.getItems('');
  },
  watch: {
  	opType(val) {
  		this.opType = val;
  	}
  },
  methods: {
  	getItems(val) {
  	if(val !== ''){
  		this.opType = val;
  	} else {
  		var _this = this;
  		$.ajax({
            url: "/api/item/getItems",
            type: "get",
            data: {getPublish: true},
            beforeSend: function(xhr) {
              _this.myFun.setToken(xhr);
            },
            success: function(data){
            	for (var i = 0; i < data.length; i++) {
    			  		var src = data[i].imgPath.split('&')[0].substring(1);
    			  		for (var key in data[i]) {
    			  			if(key == 'imgPath') {
    			  				data[i][key] = src;
    			  			}
    			  		}
    				}
            	_this.items = data;
            },
            error: function(error) {
            	console.log("获取资源失败");
              _this.myFun.tokenExpired(error)
            }
        });
  	}
  	},
  	addItem() {
  		this.opType = 'add';
  		$('.items').animate({"left":"1200px"});
  		$('.edit-item').animate({"left": "340px"});
  	},
  	modify(id) {
  		this.opType = id;
  		$('.items').animate({"left":"1200px"});
  		$('.edit-item').animate({"left": "340px"});
  	},
  	del(id) {
  		var _this = this;
  		$.ajax({
            url: "/api/item/editItem",
            type: "get",
            data: {itemId: id, type: 0},
            beforeSend: function(xhr) {
              _this.myFun.setToken(xhr);
            },
            success: function(data){
            	_this.getItems('');
            },
            error: function(error) {
              _this.myFun.tokenExpired(error)
            	console.log("删除失败");
            }
        });
  	}
  }
}
</script>

<style lang="less"> 
</style>