<template>
	<div>
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

.order {
	display: -webkit-box;
    display: flex;
    display: -ms-flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    justify-content: left;
	.order-item {
		width: 30rem;
		height: 10rem;
		margin: 0 1rem 1rem 3rem;
		background: #fff;
        opacity: 0;
        transform: translateY(30px);
        animation: show-el 1s;
        animation-fill-mode: forwards;
		padding: 1rem;
		.img {
			height: 100%;
			width: 10rem;
			float: left;
			vertical-align: middle;
			img {
				max-width: 100%;
				max-height: 90%;
			}
		}
		.info-box {
			padding: 0.2rem 0.2rem 0 1rem;
			float: left;
			width: 64%;
			p {
				margin: 0;
				text-align: left;
				font-size: 0.7rem;
				button {
					background: rgba(23, 23, 132, 0.9);
					color: #eee;
					font-size: .6rem;
					line-height: 2rem;
					position: relative;
					float: right;
					padding: 0 1rem;
					border-radius: 2rem;
					outline: none;
				}
				.del-order-btn {
					background: #909090;
					margin-left: 1em;
				}
			}
			.title {
				margin: 3rem 0 1rem 0;
				font-size: 1.1rem;
			}
			.price {
				position: relative;
				float: right;
				color: red;
			}
			.time {
				font-size: 0.7rem;
				color: #909090;
			}
		}
	}
}
@media screen and (max-width:600px){
	.order {
		justify-content: space-around;
		.order-item {
			height: 5.5rem;
		}
		.img {
			display: none;
		}
	}
}
</style>