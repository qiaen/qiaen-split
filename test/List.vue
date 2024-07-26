<template>
	https://www.hehehai.cn/posts/web-virtual-principle
	<Virtual wrap-height="400px" :data="data" key="uid">
		<template #item="item">
			<div class="item-cell">
				<h3>主题{{ item.name }}</h3>
				<div>
					<h4>子题</h4>
					<ul>
						<li v-for="sub in item.children" :key="sub.uid">{{ sub.name }}</li>
					</ul>
				</div>
			</div>
		</template>
	</Virtual>
</template>
<script setup>

import Virtual from './virtual/list.vue'
let data = Array.from({ length: 100 }, (_, mIndex) => {
	let cLength = Math.floor(Math.random() * 4) + 1
	return {
		uid: uid(),
		name: `${mIndex + 1}`,
		children: Array.from({length: cLength}, (_, sIndex) => {
			return {
				uid: uid(),
				name: `${mIndex + 1}-${sIndex + 1}`,
			}
		})
	}
})
// console.log(data)
function uid() {
	return Math.random().toString(36).substr(2, 13)
}
</script>