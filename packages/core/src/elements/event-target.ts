import { DisplayObject } from '@pixi/display'
import type { InteractionEvent } from '@pixi/interaction'

type ValueOf<T> = T[keyof T]
type StringKeys<T> = T extends string ? T : never

/**
 * 支持的事件类型
 */
export const EventTypes = [
  // pointer events
  'onPointerCancel',
  'onPointerDown',
  'onPointerMove',
  'onPointerOut',
  'onPointerOver',
  'onPointerTap',
  'onPointerUp',
  'onPointerUpOutside',

  // touch events
  'onTap',
  'onTouchCancel',
  'onTouchEnd',
  'onTouchEndOutside',
  'onTouchMove',
  'onTouchStart',

  // mouse events
  'onClick',
  'onMouseDown',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onMouseUpOutside',
  'onRightClick',
  'onRightDown',
  'onRightUp',
  'onRightUpOutside',
] as const

type EventType = StringKeys<ValueOf<typeof EventTypes>>

/**
 * 转换为小写的事件类型，用于 EventEmitter.on(...) 的注册
 * 
 * 例如：`onMouseDown` 会被转换成 `mousedown`
 */
type LowercaseEventType = EventType extends `on${infer T}` ? Lowercase<T> : never

/**
 * 通过该字段将 EventHandler 保存到当前对象
 * 
 * 例如：`onMouseDown={ fn }` 的 `fn` 会被保存到 `this._onMouseDown`
 */
type EventHandlerPrivateField = `_${keyof EventTarget}`

export type EventHandler = (event: InteractionEvent) => void

export type EventTarget = {
  [key in EventType]: EventHandler | null
}

export type EventTargetProps = Partial<EventTarget>

export type {
  InteractionEvent,
  Cursor,
  IHitArea,
} from '@pixi/interaction'

const makeEventHandlerAccessor = (key: EventType) => {
  type This = Pick<DisplayObject, 'on' | 'off'> & {
    [K in EventHandlerPrivateField]: EventHandler | null
  }
  const eventHandlerPrivateField = `_${key}` as EventHandlerPrivateField
  const lowercaseEventType = key.substr(2).toLowerCase() as LowercaseEventType
  return {
    [key]: {
      get (this: This) {
        return this[eventHandlerPrivateField] ?? null
      },
      set (this: This, value: EventHandler | null) {
        if (this[eventHandlerPrivateField]) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.off(lowercaseEventType, this[eventHandlerPrivateField]!)
        }
        this[eventHandlerPrivateField] = value
        if (value) {
          this.on(lowercaseEventType, value)
        }
      },
    }
  }
}

export let mixinEventHandlerAccessors = () => {
  const properties = EventTypes.reduce((acc, key) => {
    acc[key] = makeEventHandlerAccessor(key)[key]
    return acc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>)
  Object.defineProperties(DisplayObject.prototype, properties)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mixinEventHandlerAccessors = () => {}
}
mixinEventHandlerAccessors()

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace GlobalMixins {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DisplayObject extends EventTarget {
    }
  }
}
