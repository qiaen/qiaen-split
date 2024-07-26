
<template>
	<div ref="wrapRef" class="virtual-wrapper" :style="{ height: wrapHeight }" @scroll.passive="handleScroll">
		<div :style="paddingStyle">
			<template v-for="item in areaList" :key="item.id">
				<VirtualItem :item="item">
					<slot name="item" v-bind="item" />
				</VirtualItem>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, withDefaults, defineProps, toRefs, computed, provide } from 'vue'
import type { VirtualCtx } from './context'
import { VIRTUAL_CTX } from './context'
import type { AreaRange } from './area'
import { AreaManager } from './area'
import VirtualItem from './item.vue'
const props = withDefaults(
	defineProps<{
		data: any[]
		keyName?: string
		wrapHeight?: string
	}>(),
	{
		keyName: 'id'
	}
)

const { data, keyName } = toRefs(props)
let areaManager: AreaManager | null = null
const wrapRef = ref<HTMLElement>()
let range = ref<AreaRange>()

const dataKeys = computed(() => data.value.map((datum, idx) => datum[keyName.value] ?? idx))
const areaList = computed(() => (range.value ? data.value.slice(range.value.start, range.value.end) : []))
const paddingStyle = computed(() =>
	range.value
		? {
				paddingTop: `${range.value.padFront}px`,
				paddingBottom: `${range.value.padBehind}px`
		  }
		: {}
)

const handleScroll = () => {
	if (wrapRef.value) {
		areaManager?.handleScroll(wrapRef.value.scrollTop)
	}
}

const handleAreaChange = (v: AreaRange) => {
	range.value = v
}

const handleChangeItemSize = (key: number, size: number) => {
	areaManager?.setSize(key, size)
}

const initAreaManager = () => {
	areaManager = new AreaManager(handleAreaChange, {
		dataKeys: dataKeys.value
	})
}

initAreaManager()

provide<VirtualCtx>(
	VIRTUAL_CTX,
	reactive({
		setSize: handleChangeItemSize
	})
)
</script>


<style>
.virtual-wrapper {
	overflow-y: auto;
}
</style>
