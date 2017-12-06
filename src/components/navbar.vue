<template>
<div>
	<div class="nav">
    <div class="portrait">
      <div class="img">
        <img :src="toChildMsg.imgSrc" id="nav_portrait" />
      </div>
      <router-link to="/personal"><span v-if="toChildMsg.isExit">游客</span><span v-else>{{toChildMsg.username}}</span></router-link>
    </div> 
    <ul @click='liActive'>
      <li><i class="icon index"></i><router-link to="/index">首页</router-link><span class="bottom-line"></span></li>
      <li><i class="icon items-icon"></i><router-link to="/items">我的宝贝</router-link><span class="bottom-line"></span></li>
      <li><i class="icon personal"></i><router-link to="/personal">个人中心</router-link><span class="bottom-line"></span></li>
      <li><i class="icon message"></i>
        <router-link :to="{path: '/message', query: unreadCount != null ?{unread: unreadCount} : null}">消息
          <span id="unreadCount">{{unreadCount}}</span>
        </router-link>
        <span class="bottom-line"></span>
      </li>
      <li><i class="icon reg_log"></i>
        <router-link to="#" v-if="toChildMsg.isExit" data-toggle="modal" data-target="#loginModal" id="login">登录&nbsp;&nbsp;/</router-link>
        <router-link to="#" v-if="toChildMsg.isExit" data-toggle="modal" data-target="#regModal" id="reg">&nbsp;&nbsp;注册</router-link>
        <a href="javascript:;" v-else id="Exit" @click='Exit'>退出</a>
      <span class="bottom-line"></span></li>
    </ul>
  <div class="triangle"></div>
  </div>
    <Reglog :parent-msg="toChildMsg" @parent-msg-change='parentMsgChange'></Reglog>
  </div>
</template>
<script>
import Reglog from '@/components/reg_log'

export default {
  components: { 
    Reglog
  },
  data () {
    return {
      toChildMsg: {
        isExit: true,
        username: '',
        imgSrc: ''
      },
      unReadObj: {},
      unreadCount: null,  //未读消息总数
    }
  },
  mounted: function () { 
    // $('ul li:first').find('.bottom-line').addClass('li-active');
    if(this.$store.state.UserName) {
      this.toChildMsg.username = this.$store.state.UserName;
      this.toChildMsg.isExit = false;
      this.getUnreadMsg();
    }
    if(this.$store.state.UserImg) {
      this.toChildMsg.imgSrc = this.$store.state.UserImg;
    }
  },
  methods: {
    parentMsgChange(val) {
      this.toChildMsg = val;
      console.log(this.toChildMsg)
    },
    setUserName() {
      this.username = this.$store.state.UserName;
    },
    Exit() {
      this.$store.commit('clearUser')
      this.toChildMsg.isExit = true;
      if(this.$route.path == '/index') {
        this.$router.go(0);
      } else {
        this.$router.push({
          path: '/'
        })
      }
    },
    //获取未读消息
    getUnreadMsg() {
      var _this = this;
      $.ajax({
        url: "/api/chat/getUnreadMsg",
        type: "get",
        beforeSend: function(xhr) {
          _this.myFun.setToken(xhr);
        },
        success: function(data){
          if(data.length != 0) {
            _this.unreadCount = 0;
            for (var i = 0; i < data.length; i++) {
              _this.unReadObj[data[i].fromName] = data[i]['COUNT(fromName)'];
              _this.unreadCount += data[i]['COUNT(fromName)'];
            }
            _this.$store.commit('setUnReadObj', _this.unReadObj);
          }
        },
        error: function(error) {
          _this.myFun.tokenExpired(error)
        }
      });
    },
    liActive(e) {
      var e = e.target;
      $(e).next().addClass('li-active');
      $(e).parent().siblings().children('.bottom-line').removeClass('li-active')

    }
  }
}
</script>
<style lang="less"> 
  @common-grey: #D4D4D4;
  @dark-red: rgba(240, 27, 45, 0.9);
  #unreadCount {
    color: #da6155;
    font-size: 4px;
    margin-left: 10px;
  }
  .nav {
    width: 18.75rem;
    height: 100%;
    position: fixed;
    padding: 20px;
    background: #333;
    background: rgba(255, 255, 255, 0.2);
        a:focus {
          color: inherit;
        }

    ul {
      color: #eee;
      margin-top: 30%;
      padding-left: 0px;
      li{
        width: 80%;
        line-height: 40px;
        text-align: left;
        padding: 10px 20px 0 20px;
        transition: all ease .5s;
        .bottom-line {
          display: block;
          width: 0;
          height: 2px;
          position: relative;
          background: #ccc;
          left: -10px;
          transition: width .2s;
        }
        &:hover {
          .bottom-line {
            width: 80%;
          }
        }
        .li-active {
          width: 80%;
        }
        a.router-link-exact-active.router-link-active {
          color: #fff;
        }
        &:last-child {
          a {
            margin-left: -5px;
          }
        }
        .icon {
          width: 16px;
          height: 16px;
          margin: 0 6px -10px 0;
        }
        .index {
          background-image: url(../assets/img/index.png);
        }
        .items-icon {
          background-image: url(../assets/img/items.png);
        }
        .personal {
          background-image: url(../assets/img/personal.png);
        }
        .message {
          background-image: url(../assets/img/message.png);
        }
        .reg_log {
          background-image: url(../assets/img/reg_log.png);
          margin-left: 1px;
        }

      }
    }
    .portrait {
      padding: 0 20px;
      color: #eee;
      margin-left: -25px;
      text-align: left;
      .img {
        width: 60px;
        height: 60px;
        display: inline-block;
        border-radius: 50%;
        border: 1px solid;
        overflow: hidden;
        img {
          max-width: 100%;
          max-height: 100%;
          &:hover{
            cursor: pointer;
          }
        }
      }
      a {
        position: relative;
        left: 5px;
        font-size: 0.8rem;
        bottom: 20px;
      }
    }
  }
  @-webkit-keyframes mymove /* Safari 和 Chrome */
  {
    from {
      width: 0;
    }
    to {
      width: 120%;
    }
  }
  .triangle {
    height: 550px;
    width: 170px;
    position: absolute;
    top: 55px;
    left: 100px;
    border: 1px solid blue;
    border-left-: 250px;
    z-index: -1;
    &:before {
      content: '';
      display: block;
      width: 200px;
      height: 500px;
      background: rgba(2, 2, 123, .9);
      position: absolute;
      right: 75px;
      top: -80px;
    }
  }
</style>