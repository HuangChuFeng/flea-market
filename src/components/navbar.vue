<template>
<div>
	<div class="nav">
    <div class="portrait">
      <div class="img">
        <img :src="toChildMsg.imgSrc" id="nav_portrait" />
      </div>
      <router-link to="/personal"><span v-if="toChildMsg.isExit">游客</span><span v-else>{{toChildMsg.username}}</span></router-link>
    </div> 
    <ul>
      <li><i class="icon index"></i><router-link to="/index">首页</router-link><span class="bottom-line"></span></li>
      <li><i class="icon items-icon"></i><router-link to="/items">我的宝贝</router-link><span class="bottom-line"></span></li>
      <li><i class="icon personal"></i><router-link to="/personal">个人中心</router-link><span class="bottom-line"></span></li>
      <li><i class="icon message"></i><router-link to="/message">消息</router-link><span class="bottom-line"></span></li>
      <li><i class="icon reg_log"></i>
        <router-link to="#" v-if="toChildMsg.isExit" data-toggle="modal" data-target="#loginModal" id="login">登录&nbsp;&nbsp;/</router-link>
        <router-link to="#" v-if="toChildMsg.isExit" data-toggle="modal" data-target="#regModal" id="reg">&nbsp;&nbsp;注册</router-link>
        <a href="javascript:;" v-else id="Exit" @click='Exit'>退出</a>
      <span class="bottom-line"></span></li>
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
      }
    }
  },
  mounted: function () {
    if(this.$store.state.currentdata.UserName) {
      this.toChildMsg.username = this.$store.state.currentdata.UserName;
      this.toChildMsg.isExit = false;
    }
    if(this.$store.state.currentdata.UserImg) {
      this.toChildMsg.imgSrc = this.$store.state.currentdata.UserImg;
    }
  },
  methods: {
    parentMsgChange(val) {
      this.toChildMsg = val;
      console.log(this.toChildMsg)
    },
    setUserName() {
      this.username = this.$store.state.currentdata.UserName;
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

    }
  }
}
</script>
<style lang="less"> 
  @common-grey: #D4D4D4;
  @dark-red: rgba(240, 27, 45, 0.9);
  .nav {
    width: 300px;
    height: 100%;
    position: fixed;
    padding: 20px;
    background: #333;
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
            width: 120%;
          }
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
      text-align: left;
      color: #eee;
      .img {
        width: 60px;
        height: 60px;
        display: inline-block;
        margin-right: 20px;
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
        white-space: nowrap;
        position: relative;
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
</style>