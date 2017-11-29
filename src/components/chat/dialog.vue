<template>
		<div class="dialog">
			<div class="message-box">
				<div class="seller-msg-box">
					<p class="seller-msg" v-for="msg in sellerMsg">{{msg.content}}</p>
				</div>
				<div class="user-msg-box">
					<p class="user-msg" v-for="msg in userMsg">{{msg.content}}</p>
				</div>
			</div>
			<div class="send">
				<textarea rows="8" class="input-message" v-model="inputMsg">
				</textarea>
				<button @click='send' class="btn btn-submit">发送</button>
			</div>
		</div>
</template>

<script>
import io from 'socket.io-client'
export default {
	props: ["toChatMsg"],
	data () {
    	return {
    		socket: null,
    		sellerMsg: [],    //卖家发送的消息
    		userMsg: [],	  //买家发送的消息
    		inputMsg: null,   //输入消息
    		userName: this.$store.state.currentdata.UserName,
    	}
    },
    mounted: function() {
            //接收消息
            var _this = this;
            // this.socket.on('to'+this.sellerName, function (data) {
            	// _this.sellerMsg.push({content:data.msg});
            // });
            this.socket = io('http://localhost:3000');
    		this.socket.emit('comming in', {
    			userName: this.userName
    		});
    		this.socket.on('in', function(data) {
    			console.log(data)
    		})
            this.socket.on('to'+this.userName, function (data) {
            	console.log(data)
            	_this.sellerMsg.push({content:data.msg});
            });
    },
    watch: {
    },
    methods: {
    	send() {
    		var from = this.userName,
    			to = this.toChatMsg.sellerInfo.name,
    			msg = this.inputMsg;
    		this.userMsg.push({content: msg})
    		this.socket.emit('private message', from , to, msg);
    		this.inputMsg = null;
    	}
    }
}
</script>