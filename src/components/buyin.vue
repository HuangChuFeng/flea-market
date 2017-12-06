<template>
	<div class="order">
		<div class="order-item" v-for="item in orderItem">
			<div class="img">
				<img :src="item.imgPath">
			</div>
			<div class="info-box">
				<p>{{item.sellerName}}&nbsp;&gt;
					<button data-toggle="modal" data-target="#dealModal" @click="statusView(item.status, item.id)">
					<span v-if="item.status == 0">未付款</span>
					<span v-if="item.status == 1">等待确认</span>
					<span v-if="item.status == 2">交易成功</span>
				</button>
				</p>
				<p class="title"><span>{{item.title}}
				</span>
				<span class="price">￥ {{item.price}}</span></p>
				<p class="time">交易时间：{{item.time}}</p>
			</div>
		</div>
		<Status :order="order" @status-change='statusChange'></Status>
	</div>
</template>

<script>
import Status from '@/components/status'
export default {
	components: { 
	    Status
	},
  	data () {
    	return {
	    	orderItem: [],
	    	order: {
	    		id: null,
	    		status: null,   //订单状态
	    	}
    	}
	},
	watch: {
		'order': {
            handler:(val, oldVal) => {
            	this.order = val;
            },
            deep:true
        }
	},
	mounted: function() {
  		this.getOrders();
	},
	methods: {
		getOrders() {
			this.$http.get('/api/user/getOrders', {
				params: {
					type: 'in'
				}
		    },{}).then((response) => {
				var orderCopy = response.body;
              	for (var i = 0; i < orderCopy.length; i++) {
                	var src = orderCopy[i].imgPath.split('&')[0].substring(1);
                	for (var key in orderCopy[i]) {
	                    if(key == 'imgPath') {
	                    	orderCopy[i][key] = src;
	                    }
	                    if(key == 'time') {
	                    	var time = orderCopy[i][key].replace(/T/, '\/');
	                    	time = time.split('.')[0];
	                    	orderCopy[i][key] = time
	                    }
                	}
              	}
              	this.orderItem = orderCopy;
              	console.log('getOrders')
		    })
		    .catch(function(response) {
		        console.log("异常");
		    })
		},
		statusView(status, id) {
			this.order.status = status;
			this.order.id = id;
		},
		statusChange(val) {
			console.log('来自子组件：'+val)
			this.order = val;
            this.getOrders();

		}
	}
}
</script>

<style lang="less"> 

</style>