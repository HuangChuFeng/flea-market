<template>
	<div class="modal fade" id="dealModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<!-- 查看交易状态 -->
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
						&times;
					</button>
					<h4 class="modal-title" id="myModalLabel">
						交易状态
					</h4>
				</div>
				<div class="modal-body">
					<div class="status-box">
						<span></span><span></span>
						<div class="status-icon">
							<div class="icon" :class="order.status == 0 ? 'not-pay': 'pay'"></div>
							<p v-if="order.status == 0">等待付款</p>
							<p v-else>已付款</p>
						</div>
						<span></span><span></span><span></span>
						<div class="status-icon">
							<div class="icon":class="order.status == 2 ? 'waited': 'wait'"></div>
							<p>等待商家确认</p>
						</div>
						<span></span><span></span><span></span>
						<div class="status-icon">
							<div class="icon":class="order.status == 2 ? 'success': 'no-success'"></div>
							<p>交易成功</p>
						</div>
						<span></span><span></span>
					</div>
					<div class="btn-box">
						<p class="notice-msg" v-if="order.status == 0">若超过24小时未付款，订单将自动取消</p>
						<div  v-if="order.status == 0">
							<button class="btn btn-submit"  v-if="noAccount" @click='pay'>已线下完成付款</button>
							<button class="btn btn-submit"  v-if="account != null" @click='pay'>我已付款</button>
							<button class="btn btn-cancel" v-if="this.$route.path == '\/items\/buyin' && account == null && !noAccount" @click='getAccount'>去付款</button>
						</div>
						<button class="btn btn-submit" v-if="order.status == 1 && this.$route.path == '\/items\/sale'" @click='intoAccount'>确认到账</button>
					</div>
					<div v-if="account != null" class="account-info">
						<label>{{sellerName}}的账户:</label>
						<span>{{account}}</span>
					</div>
				</div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal -->
	</div>
</template>

<script>
	export default {
		props: ["order"],
		data () {
			return {
	    	account: null,   //卖家支付帐号
	    	sellerName: null,  //卖家姓名
	    	noAccount: false  //卖家有无支付帐号，有则可选择线上或线下付款，无则之恩那个线下付款
	    }
	},
	watch: {
		'order': {
			handler:(val,oldVal)=>{
				this.order = val;
				// console.log('status:'+this.order.status)
				// console.log('子组件ID：'+this.order.id)
			},
			deep:true
		}
	},
	mounted: function() {
	},
	methods: {
		//获取卖家支付帐号
		getAccount() {
			this.$http.get('/api/user/getAccount', {
				params: {orderId: this.order.id}
			},{}).then((response) => {
				this.account = response.body[0].account;
				this.sellerName = response.body[0].userName;
				if(this.account == null) {
					$('#paybtn').text('已线下完成付款')
					this.noAccount = true;
				}
			})
			.catch(function(response) {
				console.log("异常");
			})
		},
		//付款
		pay() {
			this.$http.post('/api/item/pay', {
				orderId: this.order.id
			},{}).then((response) => {
				this.order.status = 1;	
				this.$emit("status-change",this.order);
				this.account = null;
			})
			.catch(function(response) {
				console.log("异常");
			})
		},
		//卖家确认到账
		intoAccount() {
			this.$http.post('/api/item/intoAccount', {
				orderId: this.order.id
			},{}).then((response) => {
				this.order.status = 2;
				this.$emit("status-change",this.order);
			})
			.catch(function(response) {
				console.log("异常");
			})
		}
	}
}
</script>

<style lang="less">
	.status-box {
		.status-icon {
			display: inline-block;
			div {
				width: 6rem;
				height: 6rem;
			}
			p {
				font-size: 0.8rem;
				transform: translate3d(0, 0.8em, 0);
				opacity: 0;
			    animation: show-el 1s 1s;
			    animation-fill-mode: forwards;
			}
			.icon {
				transform: scale(0.7);
				opacity: 0;
			    animation: show-el 1s;
			    animation-fill-mode: forwards;
				background-size: 100% 100%;
			}
			.pay {
				background-image: url(../assets/img/pay.png)
			}
			.waited {
				background-image: url(../assets/img/waited.png)
			}
			.success {
				background-image: url(../assets/img/success.png)
			}
			.not-pay {
				background-image: url(../assets/img/not-pay.png)
			}
			.wait {
				background-image: url(../assets/img/wait.png)
			}
			.no-success {
				background-image: url(../assets/img/no-success.png)
			}
		}
		span {
			display: inline-block;
			width: 0.35rem;
			height: 0.35rem;
			margin: 0 1px;
			border-radius: 50%;
			position: relative;
			bottom: 4rem;
			background: #20af89;
		}
	}
	.notice-msg {
		font-size: 0.7rem;
		margin-bottom: 30px;
		color: rgba(240, 27, 45, 0.9);
	}
	.account-info {
		padding: 10px;
	}
</style>