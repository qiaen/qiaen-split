
<template>
	<div ref="itemRef" class="virtual-item">
		<slot name="default" />
	</div>
</template>
<script setup lang="ts">
import { defineProps, toRef, ref, inject, onMounted } from 'vue'
import type { VirtualCtx } from './context'
import { VIRTUAL_CTX } from './context'

const props = defineProps<{
	item: any
}>()

const item = toRef(props, 'item')
const itemRef = ref<HTMLElement>()
const virtualCtx = inject<VirtualCtx>(VIRTUAL_CTX)

onMounted(() => {
	console.log(item.value.id)
	if (virtualCtx?.setSize) virtualCtx.setSize(item.value.id, itemRef.value?.offsetHeight)
})
</script>
<style lang="scss">
.virtual-item {
	margin: 0;
	padding: 0;
	display: flow-root;
}
</style>