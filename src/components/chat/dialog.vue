<template>
	<div class="dialog">
        <p class="current-contacts">
            <i @click='back' class="icon back"></i>{{toChatMsg.sellerInfo.name}}
        </p>
		<div class="message-box">
			<div class="msg-line" v-for="msg in msgArr"
                v-bind:class="isUserMsg(msg.fromName) ? 'user-msg' : 'contacts-msg'">
                <div v-if="!isUserMsg(msg.fromName)">
                    <span class="name">{{msg.fromName}}</span>
                    <span class="msg-left" v-if="msg.type == 0">{{msg.content}}</span>
                    <span class="msg-left" v-else>
                        <div class="img-record"><img :src="msg.content" @click="preview"/>
                        </div>
                    </span>
                </div>
                <p class="time-notice" v-if="msg.overTime">{{msg.overTime}}</p>
                <div v-if="isUserMsg(msg.fromName)">
                    <span class="unread" v-if="msg.status == 0">未读</span>
                    <span class="msg-right" v-if="msg.type == 0">{{msg.content}}</span>
                    <span class="msg-right" v-else>
                        <div class="img-record"><img :src="msg.content" @click="preview"/>
                        </div>
                    </span>
                    <span class="name">{{msg.fromName}}</span>
                </div>
			</div>
		</div>
		<div class="send">
            <div class="input-message">
                <textarea class="form-control" v-model="inputMsg" @keyup.enter='send'>
                </textarea>
                <div class="viewImg" v-show="tempImg != null"><img :src="viewSrc"></div>
            </div>
            <div class="btn-wrap">
                <label class="select-pic icon"><input type="file" name="imgMsg" @change="viewImg"/></label>
                <div @click='send' class="send-btn">
                    <i class="send-icon icon"></i>
                </div>
            </div>
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
            viewSrc: null,   //发送图片时的预览地址
            tempImg: null,
            vm: this,
            
    	}
    },
    computed: {
    },
    watch: {
        msgArr(val) {
            //让滚动条始终置于底部
        },
        'msgArr': {
            handler:(val,oldVal)=>{
            },
            deep:true
        }
    },
    updated: function() {
        $('.message-box').scrollTop( $('.message-box')[0].scrollHeight );
    },
    mounted: function() {
        //接收消息
        var _this = this;
        //接收消息
        global.socket.on('to'+this.userName, function (data, fn) {
            fn('sendSuccess');
            console.log('接受消息的对象：'+data.from);
            console.log('当前对象:'+_this.toChatMsg.sellerInfo.name)
            //如果当前聊天对象为正在发送消息给我的对象则把消息加入消息列表
            if(_this.toChatMsg.sellerInfo.name == data.from) { 
                _this.toChatMsg.sellerInfo.name = data.from;
                if(data.msg.type == 1) {
                    _this.msgArr.push({
                        content:data.msg.content,
                        fromName: data.from,
                        type: 1
                    });
                } else {
                    _this.msgArr.push({
                        content:data.msg.content,
                        fromName: data.from,
                        type: 0
                    });
                }
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
        //图片消息预览
        viewImg(e) {
            var files = e.target.files || e.dataTransfer.files;
            this.tempImg = files[0];
            if (!files.length) return; 
            this.createImage(files);
            $(window).keydown(event => {
                if(event.keyCode==8) {
                    this.tempImg = null;
                }
            });
        },
        createImage(file) {
            if(typeof FileReader==='undefined'){
                alert('您的浏览器不支持图片上传，请升级您的浏览器');
                return false;
            }
            var vm = this;
            var leng = file.length;
            for(var i = 0; i < leng; i++){
                var reader = new FileReader();
                reader.readAsDataURL(file[i]); 
                reader.onload = function(e) {
                    vm.viewSrc = e.target.result;
                };                 
            }
        },
        send() {
            var from = this.userName,
                to = this.toChatMsg.sellerInfo.name,
                msg, type;
            if(to) {
                //消息类型为图片
                if(this.tempImg != null) {
                    //ajax上传图片成功后再发送
                    var formdata = new FormData();          
                    formdata.enctype = "multipart/form-data";
                    formdata.append('imgMsg', this.tempImg);
                    var _this = this;
                    $.ajax({
                        url: "/api/chat/sendMsg",
                        type: "post",
                        data: formdata,
                        processData: false, // 不处理数据
                        contentType: false, // 不设置请求头
                        cache: false,
                        success: function(data){
                            msg = { content: data.msgPath,
                                    type: 1};
                            global.socket.emit('private message', from , to, msg);
                            _this.msgArr.push({
                                content: msg.content,
                                fromName: _this.userName,
                                type: 1
                            })
                            _this.tempImg = null;
                        },
                        error: function(error) {
                            _this.myFun.tokenExpired(error)
                            console.log("发布失败");
                        }
                    })  

                } else {  //消息类型为文字
                    msg = { content: this.inputMsg,
                            type: 0};
                    global.socket.emit('private message', from , to, msg);
                    this.inputMsg = null;
                    this.msgArr.push({
                        content: msg.content,
                        fromName: this.userName,
                        type: 0
                    })
                }
            } else {
                this.myFun.showMsg('您还没有联系人', 0)
            }
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
                    for (var i = 0; i < data.length-1; i++) {
                        //两次发消息时间超过一天
                        if(new Date(data[i+1].createdTime) - new Date(data[i].createdTime) > 2 * 3600 * 1000) {
                            data[i+1]['overTime'] = data[i+1].createdTime.replace(/T/, ' ').split('.')[0];
                        }
                    }
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
        },
        //预览大图
        preview(e) {
            $('#bigImg img').attr('src', e.target.src)
            $('#bigImg').fadeIn();
            $('#bigImg img').css('animation', 'enlarge 1s')
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
        height: 65%;
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
                    top: 6px;
                    border: solid 10px;
                    font-size: 0;
                }
                .name {
                    display: inline-block;
                    position: relative;
                    line-height: 100%;
                }
                .img-record {
                    max-width: 11rem;
                    height: auto;
                    display: inline-block;
                    img {
                        max-width: 100%;
                        max-height: 100%;
                        &:hover {
                            cursor: pointer;
                        }
                    }
                }
            }
            .msg-right {
                background: rgba(0, 0, 0, 0.7);
                &:after {
                    right: -16px;
                    border-color: transparent transparent transparent rgba(0, 0, 0, 0.7);
                }
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
    .time-notice {
        text-align: center;
        color: #fff;
        font-size: 0.8rem;
        margin-top: 2rem;
    }
    .send {
        height: 25%;
        width: 100%;
        position: relative;
        padding: 0 0 0.9375rem 0.9375rem;
        .input-message {
            width: 85%;
            height: 90%;
            float: left;
            color: #000;
            textarea {
                background: rgba(255, 255, 255, 0.7);
                width: 100%;
                height: 100%;
                position: relative;
                // bottom: 70%;
                z-index: 2;
            }
            .viewImg {
                position: absolute;
                display: inline-block;
                width: 6rem;
                height: 6rem;
                top: 1rem;
                left: 2rem;
                float: left;
                z-index: 3;
                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
        .btn-wrap {
            float: right;
            margin-right: 3%;
            .select-pic {
                margin: 0;
                input {
                    display: none;
                }
            }
            .send-btn {
                margin-right: 3%;
                width: 2.5rem;
            }
            .send-icon {
               position: relative;
               top: 0.1875rem;
            }
        }
    }
}
@media screen and (max-width:600px){
  .dialog {
    .message-box {
    }
    .send {
    }
  }
}  
</style>