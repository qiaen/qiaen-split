import { h } from 'vue'
import { createComponent, hSlot } from './utils.js'
export default createComponent({
	setup(props, { slots }) {
		return () => h('div', { class: ['q-list'] }, hSlot(slots.default))
	}
})
