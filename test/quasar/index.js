import { h, ref, computed, watch, onBeforeMount, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { useVirtualScroll, useVirtualScrollProps } from './use-virtual-scroll.js'
import { getScrollTarget, scrollTargetProp } from './scroll.js'
import { createComponent, hMergeSlot, listenOpts } from './utils.js'
import List from './list.js'

export default createComponent({
	name: 'QVirtualScroll',

	props: {
		...useVirtualScrollProps,
		items: {
			type: Array,
			default: () => []
		},
		itemsFn: Function,
		itemsSize: Number,
		scrollTarget: scrollTargetProp
	},

	setup(props, { slots, attrs }) {
		let localScrollTarget
		const rootRef = ref(null)

		const virtualScrollLength = computed(() => (
			props.itemsSize >= 0 && props.itemsFn !== void 0
				? parseInt(props.itemsSize, 10)
				: (Array.isArray(props.items) ? props.items.length : 0)
		))

		const {
			virtualScrollSliceRange,
			localResetVirtualScroll,
			padVirtualScroll,
			onVirtualScrollEvt
		} = useVirtualScroll({
			virtualScrollLength, getVirtualScrollTarget, getVirtualScrollEl
		})

		const virtualScrollScope = computed(() => {
			if (virtualScrollLength.value === 0) {
				return []
			}

			const mapFn = (item, i) => ({
				index: virtualScrollSliceRange.value.from + i,
				item
			})

			return props.itemsFn === void 0
				? props.items.slice(virtualScrollSliceRange.value.from, virtualScrollSliceRange.value.to).map(mapFn)
				: props.itemsFn(virtualScrollSliceRange.value.from, virtualScrollSliceRange.value.to - virtualScrollSliceRange.value.from).map(mapFn)
		})

		const classes = computed(() =>
			'q-virtual-scroll q-virtual-scroll' + (props.virtualScrollHorizontal === true ? '--horizontal' : '--vertical')
			+ (props.scrollTarget !== void 0 ? '' : ' scroll')
		)

		const attributes = computed(() => (
			props.scrollTarget !== void 0 ? {} : { tabindex: 0 }
		))

		watch(virtualScrollLength, () => {
			localResetVirtualScroll()
		})

		watch(() => props.scrollTarget, () => {
			unconfigureScrollTarget()
			configureScrollTarget()
		})

		function getVirtualScrollEl() {
			return rootRef.value.$el || rootRef.value
		}

		function getVirtualScrollTarget() {
			return localScrollTarget
		}

		function configureScrollTarget() {
			localScrollTarget = getScrollTarget(getVirtualScrollEl(), props.scrollTarget)
			localScrollTarget.addEventListener('scroll', onVirtualScrollEvt, listenOpts.passive)
		}

		function unconfigureScrollTarget() {
			if (localScrollTarget !== void 0) {
				localScrollTarget.removeEventListener('scroll', onVirtualScrollEvt, listenOpts.passive)
				localScrollTarget = void 0
			}
		}

		function __getVirtualChildren() {
			let child = padVirtualScroll('div', virtualScrollScope.value.map(slots.default))

			if (slots.before !== void 0) {
				child = slots.before().concat(child)
			}

			return hMergeSlot(slots.after, child)
		}

		onBeforeMount(() => {
			localResetVirtualScroll()
		})

		onMounted(() => {
			configureScrollTarget()
		})

		onActivated(() => {
			configureScrollTarget()
		})

		onDeactivated(() => {
			unconfigureScrollTarget()
		})

		onBeforeUnmount(() => {
			unconfigureScrollTarget()
		})

		return () => {
			if (slots.default === void 0) {
				console.error('QVirtualScroll: default scoped slot is required for rendering')
				return
			}

			return h(List, {
				...attrs,
				ref: rootRef,
				class: [attrs.class, classes.value],
				...attributes.value
			}, __getVirtualChildren)
		}
	}
})
