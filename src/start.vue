<template>
  <div class="startImg">
    <button @click="start">开始</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  name: 'app',
  methods: {
    start() {
      $('.startImg').animate({'bottom': '100%'}, 1000);
      $('.mybody').animate({'margin-top': '0'}, 2000);
    }
  }
}
</script>

<style lang='less'>
.startImg {
  background-image: url(./assets/img/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  position: absolute;
  width: 100%;
  height: 100%;
}
.mybody {
  position: absolute;
  margin-top: 100%;
}
</style>
