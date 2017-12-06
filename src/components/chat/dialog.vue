<template>
	<div class="dialog">
        <p class="current-contacts"><i @click='back' class="icon back"></i>{{toChatMsg.sellerInfo.name}}</p>
		<div class="message-box">
			<div class="msg-line" v-for="msg in msgArr"
            v-bind:class="isUserMsg(msg.fromName) ? 'user-msg' : 'contacts-msg'">
                <div v-if="!isUserMsg(msg.fromName)"><span class="name">{{msg.fromName}}</span>
                    <span class="msg-left">{{msg.content}}</span>
                </div>
                <div v-if="isUserMsg(msg.fromName)">
                    <span class="unread" v-if="msg.status == 0">未读</span><span class="msg-right">{{msg.content}}</span><span class="name">{{msg.fromName}}</span>
                </div>
			</div>
		</div>
		<div class="send">
			<textarea class="input-message form-control" v-model="inputMsg" @keyup.enter='send'>
			</textarea>
			<div @click='send' class="send-btn"><i class="send-icon icon"></i></div>
		</div>
	</div>
</template>

<script>
// import io from 'socket.io-client'
export default {
	props: ["toChatMsg"],
	data () {
    	return {
    		socket: null,
    		inputMsg: null,    //输入消息
    		userName: this.$store.state.UserName,
            msgArr: [], 
            
    	}
    },
    computed: {
    },
    watch: {
        msgArr(val) {
            //让滚动条始终置于底部
            this.$nextTick(function(){
                $('.message-box').scrollTop( $('.message-box')[0].scrollHeight );
            })
        },
    },
    mounted: function() {
        //接收消息
        var _this = this;
        //接收消息
        global.socket.on('to'+this.userName, function (data, fn) {
            fn('sendSuccess');
            console.log(data);
            console.log('接受消息的对象：'+data.from);
            console.log('当前对象:'+_this.toChatMsg.sellerInfo.name)
            //如果当前聊天对象为正在发送消息给我的对象则把消息加入消息列表
            if(_this.toChatMsg.sellerInfo.name == data.from) { 
                _this.toChatMsg.sellerInfo.name = data.from;
                _this.msgArr.push({
                    content:data.msg,
                    fromName: data.from
                });
            } else {   //否则在正在发消息的联系人上添加有新信息标志
                _this.$emit("get-new-msg",data.from);

            }
        });
    },
    methods: {
        isUserMsg: function(fromName) {
            if(this.userName == fromName) {
                return true;
            }else {
                return false;
            }
        },
        send() {
            if(this.inputMsg != null && this.inputMsg != '\n') {
                var from = this.userName,
                    to = this.toChatMsg.sellerInfo.name,
                    msg = this.inputMsg;
                this.msgArr.push({
                    content: msg,
                    fromName: this.userName
                })
                global.socket.emit('private message', from , to, msg);
                this.inputMsg = null;
            } else {
                this.myFun.showMsg('消息不能为空')
            }
        },
        switchContacts(newName, oldName) {
        },
        //获取用户与某个联系人的聊天记录
        getChatRecord(contactsName, oldName) {
            // console.log(oldName+'切换为：'+contactsName);
            this.msgArr.length = 0;
            var _this = this;
            $.ajax({
                url: "/api/chat/getChatRecord",
                type: "get",
                data: {contactsName: contactsName},
                async: false,
                beforeSend: function(xhr) {
                    _this.myFun.setToken(xhr);
                },
                success: function(data){
                    _this.msgArr = data;
                    _this.$nextTick(function(){
                        $('.message-box').scrollTop( $('.message-box')[0].scrollHeight );
                    })
                },
                error: function(error) {
                    console.log("获取资源失败");
                    _this.myFun.tokenExpired(error)
                }
            });
        },
        back() {
            this.$router.go(-1)
        }
    }
}
</script>
<style lang='less'>
.dialog {
    width: 70%;
    height: 38.125rem;
    float: left;
    .current-contacts {
        line-height: 3.125rem;
        margin: 0;
        color: #fff;
        background:  rgba(0, 0, 0, 0.7);
        .back {
            position: relative;
            float: left;
            top: 0.3125rem;
            left: 0.3125rem;
            background-size: 100% 100%;
        }
    }
    .message-box {
        height: 24.75rem;
        width: 100%;
        padding: 0 1.875rem 0.625rem 1.875rem;
        overflow-y: scroll;
        border-bottom: 1px solid #fff;
        margin-bottom: 0.625rem;
        &::-webkit-scrollbar {  
            width: 0.375rem;  
            height: 0.375rem;  
            background-color: #eee;  
        }  
      //   &::-webkit-scrollbar-track {  
      //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
      //     border-radius: 10px;  
      //     background-color: #F5F5F5;  
      // }    
      /*定义滑块 内阴影+圆角*/  
        &::-webkit-scrollbar-thumb {  
            border-radius: 0.375rem;  
            -webkit-box-shadow: 0 0 6px rgba(255,255,255,.3);  
            background-color: #ccc;  
        }  
        /*滑块效果*/
        &::-webkit-scrollbar-thumb:hover {
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.4);
        }
        .msg-line {
            width: 100%;
            .unread {
                color: #333;
                margin-right: 10px;
            }
            .msg-left, .msg-right {
                min-height: 2.125rem;
                color: #fff;
                min-width: 9.375rem;
                max-width: 18.75rem;
                line-height: 1.5625rem;
                padding: 0.3125rem 0.9375rem;
                position: relative;
                margin: 0.9375rem auto 0;
                border-radius: 0.4375rem;
                display: inline-block;
                &:after {
                    content: '';
                    width: 0;
                    height: 0;
                    position: absolute;
                    top: 5px;
                    border: solid 10px;
                    font-size: 0;
                }
                .name {
                    display: inline-block;
                    position: relative;
                    line-height: 100%;
                }
            }
            .msg-right {
                background: rgba(0, 0, 0, 0.7);
                &:after {
                    right: -16px;
                    border-color: transparent transparent transparent rgba(0, 0, 0, 0.7);
                }
                // background: #eee;
                // color: #000;
                // &:after {
                //     right: -16px;
                //     border-color: transparent transparent transparent #eee;
                // }
            }
            .msg-left {
                background: rgba(8, 7, 177, .9);
                &:after {
                    left: -16px;
                    border-color:  transparent rgba(8, 7, 177, .9) transparent transparent;
                }
            }
            span {
                display: inline-block;
            }
        }
    }
    .user-msg {
        text-align: right;
        span {
            margin-left: 20px;
        }
    }
    .contacts-msg {
        text-align: left;
        span {
            margin-right: 1.25rem;
        }
    }

    .send {
        height: 10.625rem;
        width: 100%;
        padding: 0 0 0.9375rem 0.9375rem;
        .input-message {
            width: 85%;
            height: 90%;
            float: left;
            background: rgba(255, 255, 255, 0.7);
            color: #000;
            // border: 1px solid #fff;
        }
        .send-btn {
            float: right;
            margin-right: 4%;
            background: rgba(8, 7, 177, .9);
            border-radius: 50%;
            width: 2.5rem;
        }
        .send-icon {
           position: relative;
           top: 0.1875rem;
        }
    }
}
</style>