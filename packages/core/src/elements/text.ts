import { Text } from '@pixi/text'
import { ContainerProps } from './container'
import { defaultApplyProps } from './utils'

// 1. Props
export type TextProps = {
  text?: string
} & ContainerProps

// 2. Element
export class TextElement extends Text {

  private __width: number = 0

  get width (): number {
    return this.__width
  }

  set width (value: number) {
    this.__width = value
  }
}

// 3. Factory
export function createText ({
  text = '',
  ...props
}: TextProps): TextElement {
  const el = new TextElement(text)
  if (props) {
    defaultApplyProps(el, props)
  }
  return el
}