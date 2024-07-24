<template>
	<div class="box box-1">
		<qiaen-split split="horizontal" :value="30" @resize="onResize" @resized="onResized">
			<template #A>
				<div class="center">Top</div>
			</template>
			<template #B>
				<div class="center">Bottom</div>
			</template>
		</qiaen-split>
	</div>
	<div class="box box-1">
		<qiaen-split split="vertical">
			<template #A>
				<div class="center">Left</div>
			</template>
			<template #B>
				<div class="center">Right</div>
			</template>
		</qiaen-split>
	</div>
	<div class="box box-1">
		<qiaen-split split="vertical">
			<template #A>
				<qiaen-split split="horizontal" :value="30" @resize="onResize">
					<template #A>
						<div class="center">Top</div>
					</template>
					<template #B>
						<div class="center">Bottom</div>
					</template>
				</qiaen-split>
			</template>
			<template #B>
				<div class="center">Right</div>
			</template>
		</qiaen-split>
	</div>
</template>
<script lang="ts" setup>
import qiaenSplit from '../src/main'
function onResize(val) {
	console.log(val)
}
function onResized(val) {
	console.log('拖拽结束:',  val)
}
</script>
<style lang="scss">
* {
	margin: 0;
	padding: 0;
}
#app,body, html {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
#app {
	padding: 20px;

}
.box-1 {
	width: 400px;
	height: 180px;
	border: 2px solid #333;
	margin-bottom: 10px;
}
.center {
	font-size: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>