/** 属性
 ** min： number 允许拖拽的最小百分比数字
 ** value： number 分割值，即分割线所在的百分比
 ** split 分割的方向 - vertical：横向 - horizontal：纵向
 */
export type Props = {
	/** 允许拖拽的最小百分比数字 */
	min: number
	/** 分割值，即分割线所在的百分比 */
	value: number
	/** 分割的方向 - vertical：横向 - horizontal：纵向 */
	split: 'vertical' | 'horizontal'
}

/** 绑定事件
 ** resize 拖拽的分割值，即向左的百分比数字
 ** resized 拖拽结束的分割值，即向左的百分比数字，可用于节流
 */
export type Emits = {
	/** 拖拽的分割值，即向左的百分比数字 */
	(e: 'resize', param: number): void
	/** 拖拽结束的分割值，即向左的百分比数字，可用于节流 */
	(e: 'resized', param: number): void
}