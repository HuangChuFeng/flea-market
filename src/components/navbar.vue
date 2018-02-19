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
      <li @click="toggleSubMenu">
        <i class="icon items-icon" @click=""></i><router-link to="">我的宝贝</router-link><i class = "down"></i>
        <!-- <span class="bottom-line"></span> -->
        <ul class="sub-menu" @click.stop=''>
          <li><router-link to="/items/published">已发布</router-link></li>
          <li><router-link to="/items/collect">已收藏</router-link></li>
          <li><router-link to="/items/sale">卖出</router-link></li>
          <li><router-link to="/items/buyin">买入</router-link></li>
        </ul>
      </li>
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
      <li class="slideUp-icon" @click="hiddenMenu"><i class="up"></i></li>
    </ul>
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
        flag: false // 默认隐藏子菜单
    }
  },
  mounted: function() { 
    var href = this.$route.path;
    $(".nav a[href='#"+href+"']").next().addClass('li-active')
    if(href.indexOf('items') >= 0) {
      $('.sub-menu').toggle();
    }
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
        this.$router.go(0);
        this.$router.push({
          path: '/index'
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
      $(e).parent().siblings().children('.bottom-line').removeClass('li-active');
    },
    toggleSubMenu() {
      if(!this.flag) {
        $('.down').css("transform","rotate(540deg)");
        this.flag = true;
      } else {
        $('.down').css("transform","rotate(-360deg)");
        this.flag = false;
      }
      $('.sub-menu').toggle(500);
    },
    hiddenMenu() {
      if($(window).width() < 960) {
        $('.nav').slideUp();
      }
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
        &:hover{
          .bottom-line {
            width: 120%;
          }
        }
        .li-active {
          width: 120%;
        }
        &:last-child {
          a {
            margin-left: -6px;
          }
        }
        .icon {
          vertical-align: bottom;
          // margin: 0 6px -10px 0;
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
          margin-right: 10px;
        }
        .down {
          width: 15px;
          height: 8px;
          display: inline-block;
          position: relative;
          vertical-align: middle;
          left: 35%;
          background-image: url(../assets/img/down.png);
          background-size: 15px 8px;
          transition: transform 1s;
        }
      }
      .sub-menu {
        margin: 0;
        padding-left: 25%;
        display: none;
        li {
          font-size: 0.9rem;
          line-height: 20px;
          transition: none;
          &:hover {
            color: #c25a4f;
          }
          &:last-child {
            padding-left: 25px;
          }
          a.router-link-exact-active.router-link-active {
            color: #c25a4f;
          }
        }
      }
    }
    .portrait {
      padding: 0 20px;
      color: #eee;
      text-align: left;
      .img {
        width: 60px;
        height: 60px;
        display: inline-block;
        border-radius: 50%;
        border: 1px solid;
        overflow: hidden;
        vertical-align: middle;
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
        left: 15px;
        font-size: 0.8rem;
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
  @media screen and (max-width: 960px) {
    .nav {
      font-size: 0.8rem;
        ul {
          margin-top: 0;
          li {
            line-height: 25px;
            &:last-child {
              padding-left: 25px;
            }
          }
          .slideUp-icon {
            position: absolute;
            margin: 10% 0 0 30%;
              .up {
                width: 15px;
                height: 8px;
                display: inline-block;
                background-image: url(../assets/img/down.png);
                background-size: 15px 8px;
              }
          }
        }
        .sub-menu li{
          padding: 2px;
          &:last-child {
            margin-left: -18px;
          }
        }
      }
    }
</style>