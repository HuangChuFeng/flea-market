<template>
    <div class="firstImg">
		<div class="app-text">
	   		<h1>开启你的闲置之旅</h1>
	   		<p>Let your unused goods moving</p>
		</div>
   		<p class="right-top-text">FLEA MARKET</p>
   		<button class="next-btn" @click='showIndex'>前 往</button>
   	</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted() {
  },
  methods: {
    showIndex() {
      $('.firstImg').animate({'bottom': '100%'}, 1000)
      setTimeout(function() {
      	$('.firstImg').css('display', 'none')
      }, 1000)

    },
  }
}
</script>
<style lang='less'>
.firstImg {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 6;
  text-align: auto;
  background-image: url(../assets/img/bg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
.app-text {
	padding-top: 220px;
	margin-left: -50%;
	color: #fff;
	transform: translateY(100px);
    opacity: 0;
    animation: show-el 1s .5s;
    animation-fill-mode: forwards;
	h1 {
		font-weight: 400;
		color: #fff;
		font-size: 42px;
		letter-spacing: 5px;
	}
	p {
		position: relative;
		left: -75px;
    	top: 20px;
	}
}
.right-top-text {
	writing-mode:tb-rl;
	color: #fff;
	font-size: 20px;
	position: relative;
	left: 95%;
	top: -300px;
	opacity: 0;
    animation: show-el 1s .5s;
    animation-fill-mode: forwards;
}
.next-btn {
	padding: 5px 30px;
	border-radius: 30px;
	border: 1px solid #fff;
	background: none;
	color: #fff;
	font-size: 20px;
	position: relative;
	margin: 0 auto;
	top: 100px;
	transition: top .5s;
	transform: translateY(-100px);
	transform: scale(1.5);
    animation: show-el 1s .5s;
	opacity: 0;
    animation-fill-mode: forwards;
	&:hover {
		top: 120px;
	}
}
</style>