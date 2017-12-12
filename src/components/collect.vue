<template>
	<div class="">
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
								<i class="del icon" @click="cancelCollect(item.id)"></i>
							</div>
						</div>
						<p class="title">
						<router-link :to="{path:'/index/detail',query: {id: item.id, isCollect: true}}">{{item.title}}</router-link>
						<span>{{item.level}} 成新</span></p>
						<p class="price">￥ {{item.price}}</p>
				</div>
		</div>
	</div>
</template>


<script>
export default {
  data () {
    return {
    	items: [], //商品信息
    }
  },
  created: function(){
  	this.getItems();
  },
  methods: {
  	getItems() {
  		var _this = this;
  		$.ajax({
            url: "/api/item/getCollect",
            type: "get",
            beforeSend: function(xhr) {
              _this.myFun.setToken(xhr);
            },
            success: function(data){
              var collectItem = data.collectItem;
              for (var i = 0; i < collectItem.length; i++) {
                var src = collectItem[i].imgPath.split('&')[0].substring(1);
                for (var key in collectItem[i]) {
                  if(key == 'imgPath') {
                    collectItem[i][key] = src;
                  }
                }
              }
              _this.items = collectItem;
            },
            error: function(error) {
            	console.log("获取资源失败");
              _this.myFun.tokenExpired(error)
            }
        });
  	},
  	cancelCollect(id) {
      console.log(id);
      var _this = this, index = '';
      for (var i = 0; i < this.items.length; i++) {
        if(this.items[i].id == id) {
          index = i;
          break;
        }
      }
      $.ajax({
            url: "/api/item/collect",
            type: "post",
            data: {itemId: id, type: 0},
            beforeSend: function(xhr) {
              _this.myFun.setToken(xhr);
            },
            success: function(data){
              console.log(_this.items)
                _this.items.splice(index, 1);
                console.log(_this.items)
                _this.myFun.showMsg('已取消收藏', 1)
            },
            error: function(error) {
              _this.myFun.tokenExpired(error)
              console.log("收藏操作失败");
            }
      });
  	}
}
}
</script>