import { Filter } from '@pixi/core'
import { Container } from '@pixi/display'
import type { Cursor, EventTargetProps, IHitArea } from './event-target'
import { defaultApplyProps, defaultApplyUpdate, defaultDiffProps, mixin, UpdatePayload } from './utils'

// 1. Props
export type ContainerProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  scaleX?: number
  scaleY?: number
  pivotX?: number
  pivotY?: number
  skewX?: number
  skewY?: number
  rotation?: number
  angle?: number
  zIndex?: number
  cacheAsBitmap?: boolean
  cursor?: Cursor | null
  hitArea?: IHitArea | null
  interactive?: boolean
  interactiveChildren?: boolean
  filters?: Filter[]
} & EventTargetProps

// 2. Element
export type ContainerElement = Container

// 3. Factory
export function createContainer (props: ContainerProps): ContainerElement {
  const el = new Container()
  if (props) {
    defaultApplyProps(el, props)
  }
  return el
}

// 告诉 Reconciler 组件如何 diff
Container.prototype.__diffProps = defaultDiffProps

// 告诉 Reconciler 组件如何应用 diff
Container.prototype.__applyUpdate = defaultApplyUpdate

mixin(Container, {
  scaleX: {
    get () {
      return this.scale.x
    },
    set (value: number) {
      return this.scale.x = value
    },
  },
  scaleY: {
    get () {
      return this.scale.y
    },
    set (value: number) {
      return this.scale.y = value
    },
  },
  skewX: {
    get () {
      return this.skew.x
    },
    set (value: number) {
      return this.skew.x = value
    },
  },
  skewY: {
    get () {
      return this.skew.y
    },
    set (value: number) {
      return this.skew.y = value
    },
  },
  pivotX: {
    get () {
      return this.pivot.x
    },
    set (value: number) {
      return this.pivot.x = value
    },
  },
  pivotY: {
    get () {
      return this.pivot.y
    },
    set (value: number) {
      return this.pivot.y = value
    },
  },
})

// Workaround for global mixin 
type __Container = Container
type __ContainerProps = ContainerProps

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace GlobalMixins {
    interface Container {
      __diffProps <T extends __Container, P extends __ContainerProps>(el: T, oldProps: P, newProps: P): UpdatePayload | null
      __applyUpdate <T extends __Container>(el: T, payload: UpdatePayload): void

      scaleX: number
      scaleY: number
      skewX: number
      skewY: number
      pivotX: number
      pivotY: number
    }
  }
}
