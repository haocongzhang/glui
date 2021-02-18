import { CanvasGraphicsRenderer } from '@pixi/canvas-graphics'
import type { CanvasRenderer } from '@pixi/canvas-renderer'

const noop = () => {}

const last = <T>(xs: T[]) => xs[xs.length - 1]

export class CanvasGraphicsRendererFork extends CanvasGraphicsRenderer {

  private contextStack: CanvasRenderingContext2D[] = []

  pushContext (context: CanvasRenderingContext2D) {
    this.contextStack.push(context)
    this.renderer.context = last(this.contextStack) as any
  }

  popContext () {
    this.contextStack.pop()
    this.renderer.context = last(this.contextStack) as any
  }

  constructor () {
    super({
      context: null,
      setContextTransform: noop,
      setBlendMode: noop,
    } as unknown as CanvasRenderer)
  }
}

export const cgrf = new CanvasGraphicsRendererFork()
