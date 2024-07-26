enum ScrollDirection {
	FRONT,
	BEHIND
}

export interface AreaRange {
	start?: number
	end?: number
	padFront?: number
	padBehind?: number
}

export interface AreaOptions {
	offset?: number
	dataKeys?: Array<string>
}

// 默认 Section 的大小
const DEFAULT_KEEPS = 40
// 默认的缓存大小
const DEFAULT_BUFFER = Math.trunc(DEFAULT_KEEPS / 3)
// 预估的元素高度
const DEFAULT_ESTIMATE = 32

export class AreaManager {
	// 缓存上次滚动的偏移
	private offset = 0
	// 元素的 key 列表
	private dataKeys: string[] = []
	// 范围
	private range: AreaRange = {}

	// 元素的大小缓存
	private sizeMap = new Map<number, number>()
	// 更新 range 的触发函数
	private cb?: (v: AreaRange) => void

	constructor(cb?: (v: AreaRange) => void, options: AreaOptions = {}) {
		if (cb) this.cb = cb

		this.init(options)
	}

	// 初始化（首次计算）
	init(options: AreaOptions = {}) {
		this.offset = options.offset ?? 0
		this.dataKeys = options.dataKeys ?? []

		// 第一次展示 Section
		this.checkRange(0, DEFAULT_KEEPS - 1)
	}

	// 总元素数
	get dataSize() {
		return this.dataKeys.length
	}

	// 最后一个元素的位置
	get lastIndex() {
		return Math.max(this.dataKeys.length, 0)
	}

	// 前置虚拟元素空间
	get padFront() {
		return this.getOffsetByIndex(this.range.start)
	}

	// 后置虚拟元素空间
	get padBehind() {
		return (this.lastIndex - this.range.end!) * DEFAULT_ESTIMATE
	}

	// 更新元素大小
	setSize(key: number, size: number) {
		this.sizeMap.set(key, size)
		// TODO 动态高度，计算首屏的平均值
	}

	// 滚动事件
	handleScroll(listOffset: number) {
		// 判断方向
		const direction = listOffset > this.offset ? ScrollDirection.BEHIND : ScrollDirection.FRONT
		// 更新偏移缓存
		this.offset = listOffset

		if (direction === ScrollDirection.FRONT) this.onScrollFront()
		else this.onScrollBehind()
	}

	onScrollFront() {
		const overs = this.getOffsetOver()
		// 如果起始点没有超过，则不应更改范围
		if (overs > this.range.start!) return

		// 将Start上移一个缓冲区长度，并确保其安全性
		const start = Math.max(overs - DEFAULT_BUFFER, 0)
		this.checkRange(start, this.getEndByStart(start))
	}

	onScrollBehind() {
		const overs = this.getOffsetOver()
		// 如果在缓冲区内滚动，则范围不应更改
		if (overs < (this.range.start ?? 0) + DEFAULT_BUFFER) return

		this.checkRange(overs, this.getEndByStart(overs))
	}

	// 偏移边界（使用二分查找）
	getOffsetOver() {
		let low = 0
		let middle = 0
		let middleOffset = 0
		let high = this.dataSize

		while (low <= high) {
			// this.__binarySearchCalls++
			middle = low + Math.floor((high - low) / 2)
			middleOffset = this.getOffsetByIndex(middle)

			if (middleOffset === this.offset) return middle
			else if (middleOffset < this.offset) low = middle + 1
			else if (middleOffset > this.offset) high = middle - 1
		}

		return low > 0 ? --low : 0
	}

	// 更新
	updateRange(start: number, end: number) {
		this.range.start = start
		this.range.end = end
		this.range.padFront = this.padFront
		this.range.padBehind = this.padBehind
		if (this.cb) this.cb({ ...this.range })
	}

	// 修正范围 - 更新
	checkRange(start: number, end: number) {
		if (this.dataSize <= DEFAULT_KEEPS) {
			start = 0
			end = this.lastIndex
		}

		if (this.range.start !== start) this.updateRange(start, end)
	}

	// 基于开始返回结束
	getEndByStart(start: number) {
		return Math.min(start + DEFAULT_KEEPS - 1, this.lastIndex)
	}

	// 获取某个位置元素距离开始的偏移量
	getOffsetByIndex(index?: number) {
		if (!index) return 0

		let offset = 0
		for (let i = 0; i < index; i++) {
			const itemSize = this.sizeMap.get(i)
			offset += itemSize ?? DEFAULT_ESTIMATE
		}

		return offset
	}
}
