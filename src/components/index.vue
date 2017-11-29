<template>
  <div class="mywrap">
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
                <i class="collect icon" @click="collect(item.id)" v-bind:class="{'collected': collectArr != undefined && collectArr.indexOf(item.id+'') >= 0}"></i>
              </div>
            </div>
						<p class="title">
              <router-link :to="{path:'/index/detail',query: {id: item.id, isCollect: collectArr != undefined && collectArr.indexOf(item.id+'') >= 0 ? true : false}}">{{item.title}}</router-link>
              <span>{{item.level}} 成新</span>{{item.id}}
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
      collectArr: []
    }
  },
  created: function(){
  	this.getItems();
  },
  methods: {
  	getItems() {
  		var _this = this;
  		$.ajax({
            url: "/api/item/getItems",
            type: "get",
            data: { getAll: true },
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
      if(!this.$store.state.currentdata.Token) {
        alert('请先登录')
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
                  _this.myFun.showMsg('已取消收藏')
                } else {
                  _this.collectArr.push(id+'');
                  _this.myFun.showMsg('收藏成功')
                }
              },
              error: function(error) {
                console.log("收藏操作失败");
                _this.myFun.tokenExpired(error)
              }
        });
      }
    }
  }
}
</script>

<style lang="less">
</style>