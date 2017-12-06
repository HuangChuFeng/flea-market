<template>
	<div class="">
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
		color: #fff;
		li {
			float: left;
			padding: 5px 30px;
			border-bottom: 2px solid #fff;
			transition: all ease .2s;
			&:hover {
				cursor: pointer;
				border-bottom: 2px solid rgba(8, 7, 177, 0.9);
			}
			a:hover, a:focus {
				color: inherit;
			}
		}
	}
}


.order {
	display: -webkit-box;
    display: flex;
    display: -ms-flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    justify-content: left;
	.order-item {
		width: 25rem;
		height: 5rem;
		margin: 0 0.8rem 0.8rem 2rem;
		background: #fff;
		.img {
			height: 100%;
			width: 6rem;
			float: left;
			img {
				margin: 0.2rem 0.8rem 0 0.4rem;
				max-width: 100%;
				max-height: 90%;
			}
		}
		.info-box {
			padding: 0.2rem 0.2rem 0 1rem;
			float: left;
			width: 75%;
			p {
				margin: 0;
				text-align: left;
				font-size: 0.7rem;
				button {
					background: rgba(23, 23, 132, 0.9);
					color: #eee;
					position: relative;
					float: right;
					padding: 1px 0.8rem;
					border-radius: 0.8rem;
					outline: none;
				}
			}
			.title {
				margin-top: 0.7rem;
				margin-bottom: 0.2rem;
				font-size: 0.9rem;
			}
			.price {
				position: relative;
				float: right;
				// right: 1rem;
				color: red;
			}
			.time {
				font-size: 0.7rem;
			}
		}
	}
}
</style>