<template>
  <div id="app">
    <FirstIn v-if="firstIn"></FirstIn>
    <div class="mybody">
      <Navbar></Navbar>
      <div id="msg">
        <div class="msg">
          <i class="msg-icon"></i>
          <span></span>
        </div>
      </div>
      <!-- 预览消息图片 -->
      <div id="bigImg" @click="hiddenBigImg"><img src=""></div>
      <div class="back-top icon" id="backtopbtn" @click="backTop"></div>
      <div class="content">
        <div class="small-menu" @click="showMenu"></div>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/navbar';
import FirstIn from '@/components/firstIn'
export default {
  components: { 
    Navbar, FirstIn
  },
  data () {
    return {
      firstIn: global.firstIn
    }
  },
  name: 'app',
  mounted: function() {
    $('body').css({'height':$(window).height()});
    $('.content').css({'min-height':$(window).height()});
    
    var btn = document.getElementById("backtopbtn");
    var pageHight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
    window.onscroll = function() {
      var backtop = document.body.scrollTop;
      if(backtop >= pageHight){
        btn.style.display = "block";
      }
      else btn.style.display = "none";
    }
  },
  beforeCreate: function() {
  },
  methods: {
    backTop() {
      var timer = null;
      timer = setInterval(function() {
        var backtopvalue = document.body.scrollTop;
        var speedTop = backtopvalue / 5;
        document.body.scrollTop = backtopvalue - speedTop;
        if (backtopvalue == 0) {
          clearInterval(timer);
        }
      }, 30)
    },
    // 消息图片缩小
    hiddenBigImg() {
      $('#bigImg img').css('animation', 'shrink .5s')
      $('#bigImg').fadeOut();
    },
    showMenu() {
      $('.nav').slideDown();
    },
  }
}
</script>

<style lang='less'>
.startImg {
  background-image: url(./assets/img/bg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  position: absolute;
  width: 100%;
  height: 100%;
}
.mybody {
  // position: absolute;
  // margin-top: 100%;
}
body {
  background-image: url(./assets/img/bg3.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  overflow-x: hidden;
}
html{font-size: 16px;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 1rem;
}
.nav {
  width: 18.75rem;
  height: 100%;
  position: fixed;
  padding: 20px;
  background: #333;
  background: rgba(255, 255, 255, 0.2);
  background: #333;
}
.content {
  // background: rgba(22, 22, 22, 0.7);
  padding: 1.25rem;
  color: #000;
  margin-left: 18.75rem;
  min-height: 100%;
  overflow: hidden;
  a:hover {
    color: rgba(240, 27, 45, 0.9);
  }
  .small-menu {
    position: fixed;
    width: 40px;
    height: 40px;
    min-width: 30px;
    min-height: 30px;
    background: #333;
    top: 3px;
    left: 3px;
    display: none;
    background-image: url(./assets/img/menu.png);
    background-repeat: no-repeat;
    background-position: center center;
  }
}

#bigImg {
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 3%;
  display: none;
  z-index: 4;
  background: rgba(0, 0, 0, 0.7);
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
@media screen and (max-width: 960px) {
  .nav {
    display: none;
    z-index: 4;
    height: 50%;
    width: 14rem;
    padding: 0; 
    top: 0;
    i, .portrait {
      display: none;
    }
  }
  .content {
    margin-left: 0;
    padding-left: 3rem;
    .small-menu {
      display: block;
    }
  }
}
@media screen and (max-width:600px){
  html {
    font-size: 12px;
  }
  .content {
    padding: 0; 
    padding-top: 20px;
  }
}
@-webkit-keyframes enlarge /* Safari 和 Chrome */
{
  0% {
    max-width: 0;
    max-height: 0;
  }
  50% {
    max-width: 110%;
    max-height: 110%;
  }
  100% {
    max-width: 100%;
    max-height: 100%;
  }
}
@-webkit-keyframes shrink /* Safari 和 Chrome */
{
  from {
    max-width: 100%;
    max-height: 100%;
  }
  to {
    max-width: 0;
    max-height: 0;
  }
}
</style>
