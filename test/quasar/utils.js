
import { markRaw, defineComponent } from 'vue'
export let rtlHasScrollBug = false
export function createComponent(raw) { return markRaw(defineComponent(raw)) }
export const listenOpts = {
	hasPassive: false,
	passiveCapture: true,
	notPassiveCapture: true
}

export function hMergeSlot(slot, source) {
	return slot !== void 0
		? source.concat(slot())
		: source
}
export function hSlot(slot, otherwise) {
	return slot !== void 0
		? slot() || otherwise
		: otherwise
}
export function debounce(fn, wait = 250, immediate) {
	let timer = null
	function de(/* ...args */) {
		const args = arguments
		const later = () => {
			timer = null
			if (immediate !== true) {
				fn.apply(this, args)
			}
		}
		if (timer !== null) {
			clearTimeout(timer)
		}
		else if (immediate === true) {
			fn.apply(this, args)
		}
		timer = setTimeout(later, wait)
	}
	de.cancel = () => {
		timer !== null && clearTimeout(timer)
	}
	return de
}