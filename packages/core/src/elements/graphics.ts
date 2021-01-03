import { Graphics as PixiGraphcis } from '@pixi/graphics'
import type { ContainerProps } from './container'
import { defaultApplyProps } from './utils'

/**
 * 描述一个绘图方法，他接受一个参数 `g`，通过他你可以进行任意绘图操作
 * 
 * ```ts
 * const drawRect = (g: Graphics) => {
 *  g.beginFill(0xff0000)
 *  g.drawRect(0, 0, 100, 100)
 *  g.endFill()
 * }
 * <Grahpics draw={ drawRect } />
 * ```
 */
export type Draw = (g: GraphicsElement) => void

// 1. Props
export type GraphicsProps = {
  draw?: Draw | null
} & ContainerProps


// 2. Element
export class GraphicsElement extends PixiGraphcis {

  protected _draw?: Draw | null
  /**
   * 通过 props 设置 `draw` 时，立即调用他以便重绘
   */
  set draw (value: Draw | null) {
    if (this._draw === value) {
      return
    }
    this._draw = value
    this.clear()
    if (this._draw) {
      this._draw(this)
    }
  }
}

// 3. Factory
export function createGraphics (props?: GraphicsProps) {
  const el = new GraphicsElement()
  if (props) {
    defaultApplyProps(el, props)
  }
  return el
}
