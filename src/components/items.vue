<template>
	<div class="mywrap">
		<div class="items-header">
			<ul>
				<li><router-link to="/items/published">已发布</router-link></li>
				<li><router-link to="/items/collect">已收藏</router-link></li>
				<li><router-link to="/items/sale">卖出</router-link></li>
				<li><router-link to="/items/buyin">买入</router-link></li>
			</ul>
		</div>
		<router-view/>
	</div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="less"> 
@common-grey: #D4D4D4;
@dark-red: rgba(240, 27, 45, 0.9);
@light-red: rgb(240, 27, 45);

@media screen and (max-width: 1200px) {
	.items-box{
		justify-content: space-around;
	}
}
.mywrap {
  background-color: rgba(255, 255, 255, 0.5);
  padding-top: 10px;
  min-height: 460px;
  overflow: hidden;
}
.items-header {
	ul {
		margin-left: -20px;
		overflow: hidden;
		li {
			float: left;
			padding: 5px 30px;
			border-bottom: 2px solid #fff;
			transition: all ease .2s;
			&:hover {
				cursor: pointer;
				border-bottom: 2px solid @dark-red;
			}
			a:focus {
				color: @dark-red;
			}
		}
	}
}

</style>