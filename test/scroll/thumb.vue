<template>
	<div
		@mouseup="mouseup" 
		@mousedown="mousedown" 
		class="qiaen-scroll-thumb"
		:style="{transform: `translate3d(0, ${top}px, 0)`, height: `${height}px`}"
	/>
</template>
<script setup lang="ts">
import { defineProps, ref, defineEmits, defineExpose } from 'vue'
let props = defineProps(['height', 'top', 'isDrag'])
let emits = defineEmits(['setThumbMove', 'update:isDrag'])

let startY = 0
let oTop = 0
/** 滑杆移动 */
function thumbMove(e: MouseEvent) {
	if (e.buttons === 0 || e.which === 0) {
		setDrag(false)
	}
	if (props.isDrag) {
		// console.log(props.thumbStyle.top)

		let y = e.pageY - startY + oTop
		// console.log(y)
		emits('setThumbMove', y)
	}
}
function setDrag(t: boolean) {
	emits('update:isDrag', t)
}
function mousedown(e: MouseEvent) {
	startY = e.pageY
	oTop = props.top
	setDrag(true)
}
function mouseup(e: MouseEvent) {
	setDrag(false)
}
defineExpose({
	thumbMove
})
</script>