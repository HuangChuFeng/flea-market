<template>
  <div id="app">
    <Navbar></Navbar>
      <div id="msg">
        <div class="msg">
          <i class="yes"></i>
          <span></span>
        </div>
      </div>
      <div class="back-top icon" id="backtopbtn" @click="backTop"></div>
      <div class="content">
      <div class="small-menu"></div>
        <router-view/>
        <!-- <footer>FROM 黄初凤</footer> -->
      </div>
  </div>
</template>

<script>
import Navbar from '@/components/navbar';
export default {
  components: { 
    Navbar
  },
  data () {
    return {
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
    }
  }
}
</script>

<style lang='less'>
body {
  background-image: url(./assets/img/background.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  overflow-x: hidden;
  // opacity:0.6;
  //   filter:"alpha(opacity=60)";
  //   -ms-filter:"alpha(opacity=60)"; /* 旧版IE */
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
.content {
  background: rgba(22, 22, 22, 0.7);
  padding: 1.25rem;
  color: #000;
  margin-left: 18.75rem;
  min-height: 100%;
  overflow: hidden;
  a:hover {
    color: rgba(240, 27, 45, 0.9);
  }
  .small-menu {
    position: absolute;
    width: 3rem;
    height: 3rem;
    background: blue;
    top: 3px;
    left: 3px;
    display: none;
  }
}
footer {
  position: relative;
  margin-top: 6.25rem;
  bottom: -1.25rem;
  left: -1.25rem;
  width: 110%;
  height: 2.5rem;
  line-height: 2.5rem;
  color: #fff;
  background-color: #e3574b;
}
@media screen and (max-width: 960px) {
    .nav {
        display: none;
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
  .mywrap {
    height: 100%;
  }
}  
</style>
