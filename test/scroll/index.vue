<template>
	<div class="qiaen-scroll" :style="dragStyle">
		<div ref="refQiaenScroll" class="qiaen-scroll-content" @mouseenter="initBar" @mouseleave="hideBar" @scroll="scroll">
			<slot></slot>
		</div>
		<div @mousemove="mousemove" @mouseenter="initBar" @click="trackClick" class="qiaen-scroll-track" v-if="thumbHeight < boxH" :style="`opacity: ${mouseIn ? 1 : 0};`">
			<Thumb ref="refThumb" @click.stop v-model:isDrag="isDrag" :height="thumbHeight" :top="thumbTop" @setThumbMove="setThumbMove" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { defineExpose, ref, computed } from 'vue'
import Thumb from './thumb.vue'
let refQiaenScroll = ref<any>()
let boxH = ref(0)
let contextH = 1
let thumbTop = ref(0)
let thumbHeight = ref(0)
/** 鼠标是否移入滚动条 */
let mouseIn = ref(false)
let time: any = null
let realHeight = 0
/**  初始化bar信息, 对bar的高度，盒子的高度，内容的高度做了节流，2000秒获取一起 */
function initBar() {
	let n = new Date().getTime()
	if (!time || time < n - 2000) {
		boxH.value = refQiaenScroll.value.clientHeight
		contextH = refQiaenScroll.value.scrollHeight
		realHeight = Math.ceil(boxH.value / contextH * boxH.value)
		console.log(realHeight)
		thumbHeight.value = Math.max(realHeight, 20)
		time = n
	}
	let st = refQiaenScroll.value.scrollTop
	// console.log(contextH)
	thumbTop.value = Math.max(st / contextH * boxH.value - (realHeight < 20 ? 20 - realHeight : 0), 0)
	mouseIn.value = true
}
function hideBar() {
	mouseIn.value = false
}
/** 页面滚动 */
function scroll() {
	initBar()
	mouseIn.value = true
}

let isDrag = ref(false)
let dragStyle = computed<any>(() => {
	return {
		userSelect: isDrag.value ? 'none' : 'inherit',
		'--track-width': isDrag.value? '70%': '8px'
	}
})
let refThumb = ref<any>()
/** 在滚动轴上拖拽 */
function mousemove(e:MouseEvent) {
	refThumb.value.thumbMove(e)
}
function trackClick(e:MouseEvent) {
	// console.log(e.)
	setThumbMove(e.offsetY - thumbHeight.value / 2)
}
/** 滑杆移动距离 */
function setThumbMove(y: number) {
	thumbTop.value = y
	// console.log(thumbTop.value)
	let st = y / boxH.value * contextH
	refQiaenScroll.value.scrollTop = st
}
/** 滚动到指定位置 px */
function scrollTo(topPx: number) {
	refQiaenScroll.value.scrollTop = topPx
}
defineExpose({
	scrollTo
})
</script>
<style lang="scss">
.qiaen-scroll {
	position: relative;
	height: 100%;
	width: 100%;
	overflow: auto;
	--track-width: 8px;
	.qiaen-scroll-content {
		width: 100%;
		height: 100%;
		overflow: auto;
		&::-webkit-scrollbar {
			width: 0;
			height: 0;
		}
	}
	
	.qiaen-scroll-track {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: var(--track-width);
		overflow: hidden;
	}
	.qiaen-scroll-thumb {
		min-height: 20px;
		border-radius: 12px;
		width: 8px;
		box-sizing: border-box;
		border: 1px solid transparent;
		background-color: rgba(0, 0, 0, 0.1);
		position: absolute;
		background-clip: padding-box;
		transform: translate3d(0, 0, 0);
		cursor: pointer;
		right: 0;
		&:hover{
			background-color: rgba(0, 0, 0, 0.3);
		}
	}
	
}

</style>