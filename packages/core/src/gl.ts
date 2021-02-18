import { BatchRenderer, Renderer } from '@pixi/core'
import { InteractionManager } from '@pixi/interaction'
import { Prepare } from '@pixi/prepare'
// import '@pixi/mixin-cache-as-bitmap'
import '@pixi/mixin-get-global-position'
import { skipHello } from '@pixi/utils'

let configureRenderer = () => {
  skipHello()
  Renderer.registerPlugin('interaction', InteractionManager)
  Renderer.registerPlugin('prepare', Prepare)
  Renderer.registerPlugin('batch', BatchRenderer)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configureRenderer = () => { }
}

export type MakeGlOptions = {
  surface: HTMLCanvasElement
  width: number
  height: number
  pixelRatio?: number
  antialias?: boolean
  backgroundColor?: number
}

export const makeGl = ({
  surface,
  width,
  height,
  pixelRatio,
  antialias,
  backgroundColor = 0xEFEFEF,
}: MakeGlOptions) => {
  configureRenderer()
  const gl = Renderer.create({
    view: surface,
    width,
    height,
    resolution: pixelRatio,
    autoDensity: true,
    antialias,
    backgroundColor,
  })
  return gl
}
