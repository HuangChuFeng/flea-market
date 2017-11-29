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
  // background-repeat: no-repeat;
  // background: -webkit-gradient(linear, left bottom, right top, from(#ebbba7), to(#cfc7f8));
  overflow-x: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.content {
  padding: 20px;
  margin-left: 300px;
  min-height: 100%;
  overflow: hidden;
  a:hover {
    color: rgba(240, 27, 45, 0.9);
  }
}
footer {
  position: relative;
  margin-top: 100px;
  bottom: -20px;
  left: -20px;
  width: 110%;
  height: 40px;
  line-height: 40px;
  color: #fff;
  background-color: #e3574b;
}

</style>
