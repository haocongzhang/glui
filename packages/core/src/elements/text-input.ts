import { Rectangle } from '@pixi/math'
import { TextElement, TextProps } from './text'
import { defaultApplyProps } from './utils'

// 1. Props
export type TextInputProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  multiline?: boolean
  autoSize?: boolean
  onInput?: HTMLInputElement['oninput']
  disabled?: boolean
} & Omit<TextProps, 'text'>

// 2. Element
export class TextInputElement extends TextElement {

  /**
   * 通过 DOM 与用户输入进行交互
   */
  // private inputDelegate: HTMLInputElement | HTMLTextAreaElement | null = null

  constructor () {
    super('')
    this.cursor = 'text'
    this.interactive = true

    this.hitArea = new Rectangle(0, 0, 200, 20)
    // this.mask = new Graphics()
    // this.renderable = false
  }

  private _disabled = false
  public get disabled (): boolean {
    return this._disabled
  }
  public set disabled (value: boolean) {
    if (value === this._disabled) {
      return
    }
    this._disabled = value
  }

  private _defaultValue: string | null = null
  get defaultValue () {
    return this._defaultValue 
  }
  set defaultValue (value: string | null) {
    if (this.defaultValue === value) {
      return
    }
    this._defaultValue = value
    this.updateValue()
  }

  private updateValue () {
    this.text = this._defaultValue ?? ''
  }

}

// 3. Factory
export function createTextInput (props: TextInputProps): TextInputElement {
  const el = new TextInputElement()
  if (props) {
    defaultApplyProps(el, props)
  }
  return el
}
