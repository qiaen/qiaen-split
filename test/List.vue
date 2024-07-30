<template>
	
	<!-- <a href="https://www.quasar-cn.cn/vue-components/virtual-scroll">https://www.quasar-cn.cn/vue-components/virtual-scroll</a> -->
	<div style="width: 400px;height: 400px;background-color: #eee;">
		<Scroll id="this-box">
			<h2 class="title">大数据虚拟滚动 <button @click="scroll">滚动到第896个</button></h2>
			<ol style="padding: 0 43px;">
				<li>支持元素高度不固定</li>
				<li>支持数据动态删减</li>
				<li>支持锚点根据id滚动到指定位置</li>
				<li>一键到底</li>
			</ol>
			
			<Virtual scroll-target="#this-box .qiaen-scroll-content" :items="data" v-slot="{ item, index }" ref="refV" :virtualScrollItemSize="162" :virtual-scroll-slice-size="20">
				<div class="item-cell" :style="highLightIndex === index ? `background-color: rgba(255, 0, 0, 0.2)`: ''">
					<h3>主题-{{ item.name }} <button @click="setmain(true, index)">+</button> <button @click="setmain(false, index)"> - </button></h3>
					<div>
						<h4>子题 <button @click="addsub(index)">+</button></h4>
						<ul class="my-ul">
							<li v-for="sub in item.children" :key="sub.uid">{{ sub.name }}</li>
						</ul>
					</div>
				</div>
			</Virtual>
		</Scroll>
	</div>
	<div style="width: 400px;height: 300px;background-color: #eee;margin-top: 20px;">
		<Scroll>
			<ol style="padding: 0 43px;">
				<li>支持元素高度不固定</li>
				<li>支持数据动态删减</li>
				<li>支持锚点根据id滚动到指定位置</li>
				<li>一键到底</li>
			</ol>
			<h2 class="title">大数据虚拟滚动 <button @click="scroll">滚动到第896个</button></h2>
			<div v-for="(item, index) in data">
				<div class="item-cell" :style="highLightIndex === index ? `background-color: rgba(255, 0, 0, 0.2)`: ''">
					<h3>主题-{{ item.name }} <button @click="setmain(true, index)">+</button> <button @click="setmain(false, index)"> - </button></h3>
					<div>
						<h4>子题 <button @click="addsub(index)">+</button></h4>
						<ul class="my-ul">
							<li v-for="sub in item.children" :key="sub.uid">{{ sub.name }}</li>
						</ul>
					</div>
				</div>
			</div>
		</Scroll>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import Virtual from './quasar/index'
import Scroll from './scroll/index.vue'
let highLightIndex = -1
let refV = ref()
function scroll() {
	refV.value.scrollTo(899)
	highLightIndex = 899
	setTimeout(() => {
		highLightIndex - -1
	}, 1000)
}
function setmain(isAdd, index) {
	if (isAdd) {
		let id = uid()
		let sid = uid()
		data.value.splice(index + 1, 0, {
			id,
			name: '新添加',
			children: [{
					id: sid,
					name: '新添加 子题'
				}]
		})
	} else {
		data.value.splice(index, 1)
	}
}
function addsub(index) {
	let da = data.value[index]
	let id = uid()
	da.children.push({
		id,
		name: '新添加 子题'
	})
}
let data = ref(
	Array.from({ length: 100 }, (_, mIndex) => {
		let cLength = Math.floor(Math.random() * 4) + 1
		let id = uid()
		return {
			id,
			name: id,
			children: Array.from({ length: cLength }, (_, sIndex) => {
				let id = uid()
				return {
					id,
					name: id
				}
			})
		}
	})
)
function uid() {
	return Math.random().toString(36).substr(2, 20)
}
</script>
<style lang="scss">
.title {
	position: sticky;
	top: 0;
	background-color: #fff;
	padding: 8px 15px;
}
.q-list {
	padding: 15px;
}
html, body, #this-box, #app{
	height: 100%;
	width: 100%;
	overflow: hidden;
}

* {
	margin: 0;
	padding: 0;
}
h3 {
	padding-top: 15px;
}
h4 {
	padding-top: 12px;
}
.my-ul {
	padding: 10px 18px;
}
button {
	border: none;
	height: 20px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 4px;
	background-color:aliceblue;
	color: #333;
	min-width: 24px;
	padding: 0 8px;
	cursor: pointer;
}
</style>
