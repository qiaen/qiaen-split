export const VIRTUAL_CTX = Symbol('VIRTUAL')

export interface VirtualCtx {
	setSize?: (idx: number, size: number) => void
}
