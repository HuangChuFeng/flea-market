<template>
	<div class="mywrap">
		<!-- 根据点击联系人来切换聊天窗口 -->
		<ChatDiaLog :toChatMsg="toChatMsg"></ChatDiaLog>
		<!-- 联系人列表 -->
		<div class="connect-list">
			<ul>
				<li v-for="item in seller" @click='startChat(item.contactsName)'>{{item.contactsName}}</li>
			</ul>
		</div>
	</div>
    
</template>

<script>
import io from 'socket.io-client'
import ChatDiaLog from '@/components/chat/dialog'

export default {
	components: { 
    	ChatDiaLog
  	},	
	data () {
    	return {
    		seller: [],       //联系人列表
    		userName: this.$store.state.currentdata.UserName,
    		sellerName: null,
    		toChatMsg: {
    			sellerInfo: {
    				name: null,
    				id: null
    			}
    		}
    	}
    },
    mounted: function() {
    	var _this = this;
    	$.ajax({
            url: "/api/chat/getContacts",
            type: "get",
            async: false,
            beforeSend: function(xhr) {
              	_this.myFun.setToken(xhr);
            },
            success: function(data){
              	_this.seller = data;
              	
            },
            error: function(error) {
            	console.log("获取资源失败");
              	_this.myFun.tokenExpired(error)
            }
        });
		if(this.$route.query !== {}) {
			// this.toChatMsg.sellerInfo.name = );
			// this.toChatMsg.sellerInfo.id = this.$route.query.sellerId;
			var sellerName = decodeURI(decodeURI(this.$route.query.sellerName));
			var sellerArr = this.seller.map(function(item) {
				return item.contactsName;
			})
			// 当前买家已经是用户的历史联系人
			if(sellerArr.indexOf(sellerName) < 0) {
				this.seller.push({
					id: this.toChatMsg.sellerInfo.id, 
					contactsName: sellerName
				})
			}
		}
    	
    },
    methods: {
    	startChat(contactsName) {
    		this.toChatMsg.sellerInfo.name = contactsName;
    		console.log(this.toChatMsg.sellerInfo.name)
    	} 
    }
}
</script>

<style lang='less'>
.wrap {
	// width: 100%;
	height: 100%;
	overflow: auto;
}
.dialog {
	border: 1px solid;
	width: 70%;
	height: 580px;
	float: left;
	padding: 5px;
	.message-box {
		height: 70%;
		width: 100%;
		border: 1px solid;
		.seller-msg-box {
			float: left;
			width: 50%;
			height: 100%;
			border: 1px solid;
		}
		.user-msg-box {
			float: right;
			width: 50%;
			height: 100%;
			border: 1px solid;
		}
	}

	.send {
		height: 30%;
		width: 100%;
		border: 1px solid;
		.input-message {
			width: 80%;
			// height: 100%;
			float: left;
		}
		button {
			float: right;
		}
	}
}
.connect-list {
	border: 1px solid;
	width: 30%;
	height: 580px;
	float: right;
	li {
		&:hover {
			cursor: pointer;
		}
	}
}

</style>