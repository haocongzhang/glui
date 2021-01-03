import { Texture } from '@pixi/core'
import { Sprite } from '@pixi/sprite'
import type { ContainerProps } from './container'
import { defaultApplyProps } from './utils'

// 1. Props
export type ImageProps = {
  href?: string
  anchorX?: number
  anchorY?: number
} & ContainerProps

// 2. Element
export class ImageElement extends Sprite {

  private _href?: string | null

  get href () {
    return this._href ?? null
  }

  set href (value: string | null) {
    if (value === this._href) {
      console.error('value', value)
      return
    }
    if (this.texture) {
      this.texture.destroy()
      this.texture = Texture.EMPTY
    }
    this._href = value
    if (value) {
      // 更新贴图
      // todo 贴图池
      this.texture = Texture.from(value)
    }
  }

  get anchorX () {
    return this.anchor.x
  }

  set anchorX (value: number) {
    this.anchor.x = value
  }

  get anchorY () {
    return this.anchor._y
  }

  set anchorY (value: number) {
    this.anchor.y = value
  }

}

// 3. Factory
export function createImage (props: ImageProps): ImageElement {
  const el = new ImageElement()
  if (props) {
    defaultApplyProps(el, props)
  }
  return el
}
