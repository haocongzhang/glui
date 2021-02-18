import { Graphics as PixiGraphcis } from '@pixi/graphics'
import type { ContainerProps } from '../container'
import type { Draw } from './types'
import { defaultApplyProps } from '../utils'

// 1. Props
export type GraphicsGlProps = {
  draw?: Draw<GraphicsGlElement> | null
} & ContainerProps


// 2. Element
export class GraphicsGlElement extends PixiGraphcis {

  protected _draw?: Draw<GraphicsGlElement> | null
  /**
   * 通过 props 设置 `draw` 时，立即调用他以便重绘
   */
  set draw (value: Draw<GraphicsGlElement> | null) {
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
export function createGraphicsGl (props?: GraphicsGlProps) {
  const el = new GraphicsGlElement()
  if (props) {
    defaultApplyProps(el, props)
  }
  return el
}
