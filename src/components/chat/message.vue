<template>
	<div class="mywrap">
		<!-- 根据点击联系人来切换聊天窗口 -->
		<ChatDiaLog :toChatMsg="toChatMsg" ref='update' @get-new-msg="getNewMsg"></ChatDiaLog>
		<!-- 联系人列表 -->
		<div class="connect-list">
			<p>联系人<i class="icon contacts"></i></p>
			<ul>
				<li v-for="(item, index) in seller" @click='selectContacts(item.contactsName, index)'
				:class="{'current': currentIndex == index }">{{item.contactsName}}
				<span :class="{'new-msg': newMsgsender.length != 0 &&newMsgsender.indexOf(item.contactsName) >= 0}"></span>
				<span v-if = "unRead[item.contactsName]" class='unread-msg'>{{unRead[item.contactsName]}}</span>
			</li>
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
    		userName: this.$store.state.UserName,
    		sellerName: null,
    		toChatMsg: {   //当前聊天对象信息
    			sellerInfo: {
    				name: null,
    				id: null
    			}
    		},
    		currentIndex: 0,
    		newMsgsender: [],   //新消息发送者
    		unRead: []
    	}
    },
    watch: {
    	'toChatMsg.sellerInfo': {
    		handler: (val, oldVal) => {
            	// console.log('parent watch');

            },
            deep:true
        }
    },
    mounted: function() {
    	this.getContacts();
    },
    methods: {
    	getContacts() {
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
    		var queryName = this.$route.query.sellerName;
	        //有路由参数
	        if(queryName != undefined) {  
	        	var sellerName = decodeURI(decodeURI(queryName));
	        	var sellerArr = this.seller.map(function(item) {
	        		return item.contactsName;
	        	})
	        	this.toChatMsg.sellerInfo.name = sellerName;
				// 不是历史联系人，向联系人列表开头添加当前卖家
				if(sellerArr.indexOf(sellerName) < 0) {
					this.seller.unshift({
						id: this.toChatMsg.sellerInfo.id, 
						contactsName: sellerName
					})
				} else {   // 当前买家已经是用户的历史联系人，置为选中状态
					this.toChatMsg.sellerInfo.name = this.seller[sellerArr.indexOf(sellerName)].contactsName;
					this.selectContacts(this.toChatMsg.sellerInfo.name, sellerArr.indexOf(sellerName))
				}
			} else {  //没有路由参数
		        if(this.seller.length != 0) {   //历史联系人不为空
		        	this.toChatMsg.sellerInfo.name = this.seller[0].contactsName;
		        	this.selectContacts(this.toChatMsg.sellerInfo.name, 0)
		        }
		    }
			//传来未读消息
			if(this.$route.query.unread) {
				var unReadObj = this.$store.state.unRead;
				for(var key in unReadObj) {
					//如果不是第一个则加标志
					if(this.seller[0].contactsName != key){  
						this.unRead[key] = unReadObj[key];
					} else {  
						//是第一个自动发请求置消息为已读
						console.log('key:'+key)
						// console.log(unReadObj[key]);
						this.setRead(key, unReadObj[key])
					}
				}
			}
		},
		selectContacts(contactsName, index) {
			this.newMsgsender.length = 0;
			var oldName = this.toChatMsg.sellerInfo.name;
    		//调用子组件方法
    		if(this.unRead[contactsName] && parseInt($('#unreadCount').text()) > 0) {
    			//把未读消息置为已读
    			this.setRead(contactsName, this.unRead[contactsName]);
    		}
    		this.currentIndex = index;
    		this.$refs.update.getChatRecord(contactsName, oldName);
    		this.toChatMsg.sellerInfo.name = contactsName;
    	},
    	getNewMsg(fromName) {
    		console.log('来自子组件：'+fromName+'发来新消息')
    		this.newMsgsender.push(fromName);
    	},
    	//把未读消息置为已读
    	setRead(contactsName, subtractor) {
    		var _this = this;
    		$.ajax({
    			url: "/api/chat/setRead",
    			type: "post",
    			data: {fromName: contactsName},
    			async: false,
    			dataType: 'json',
    			beforeSend: function(xhr) {
    				_this.myFun.setToken(xhr);
    			},
    			success: function(data){
    				var sum = parseInt($('#unreadCount').text());
    				subtractor = parseInt(subtractor);
    				if(sum > 0) {
    					var surplus = sum - subtractor;
    					if(surplus == 0){
    						$('#unreadCount').text('');
    					}
    					$('#unreadCount').text(surplus);
    				} else {
    					$('#unreadCount').text('');
    				}
    				delete _this.unRead[contactsName];
    			},
    			error: function(error) {
    				console.log("修改为已读失败");
    				_this.myFun.tokenExpired(error)
    			}
    		});
    	}
    	
    }
}
</script>

<style lang='less'>
	.mywrap {
		padding-top: 0;
		margin: 20px 10%;
		overflow: auto;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.4);
		-webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
		-moz-box-shadow: 0 0 8px rgba(0, 0, 0, 0.5); 
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	}
	.connect-list {
		width: 30%;
		height: 37.5rem;
		float: right;
		border-left: 1px solid #fff;
		p {
			line-height: 41px;
			color: #fff;
			background: rgba(8, 7, 177, .9);
			margin: 0;
			.contacts {
				width: 1.125rem;
				height: 1.125rem;
				position: relative;
				background-size: 1.125rem 1.125rem;
				top: 8px;
				left: 5px;	
			}
		}
		ul {
			padding: 0;
			li {
				line-height: 3.125rem;
				text-align: left;
				padding-left: 40%;
				&:hover {
					cursor: pointer;
				}
			}
			.current {
				background: rgba(0, 0, 0, 0.7);
				color: #fff;
			}
			.new-msg {
				width: 5px;
				height: 5px;
				position: relative;
				bottom: 2px;
				border-radius: 50%;
				display: inline-block;
				background-color: rgba(241, 49, 65, 0.8);
				left: 20px;
			}
			.unread-msg {
				color: #da6155;
			}
		}
	}
	// 移动端联系人列表样式
	@media screen and (max-width:600px){
		.mywrap {
			margin:0;
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
		}
		.connect-list {
			position: fixed;
			right: -200px;
			margin-top: 41px;
			border: none;
			height: auto;
			p {
				display: none;
			}
			ul {
				border-top: 1px solid #fff;
				background: rgba(255, 255, 255, 0.9);
			}
		}
	}  
</style>