import { IBatchableElement, Renderer, Texture } from '@pixi/core'
import { IDestroyOptions } from '@pixi/display'
import { Graphics, GraphicsGeometry } from '@pixi/graphics'
import {
  Point,
  Rectangle
} from '@pixi/math'
import type { ContainerProps } from '../container'
import { defaultApplyProps } from '../utils'
import { cgrf } from './canvas-graphics-renderer-fork'
import { canvasPool } from './canvas-pool'
import type { Draw } from './types'

const DEBUG_GRAPHICS = true

// 1. Props
export type GraphicsProps = {
  draw?: Draw<GraphicsElement> | null
} & ContainerProps

const indices = new Uint16Array([0, 1, 2, 0, 2, 3])
const uvs = new Float32Array(8)

// 2. Element
export class GraphicsElement extends Graphics implements IBatchableElement {

  _texture: Texture

  uvs = uvs

  vertexData = new Float32Array(8)

  indices = indices

  _tintRGB = 0xFFFFFF

  private canvas: HTMLCanvasElement

  private context: CanvasRenderingContext2D

  private _textureID = -1

  private _anchor = new Point()

  private shouldUpdateTexture = true

  private geometryDirty = -1

  private resolution = 1

  constructor(geometry?: GraphicsGeometry) {
    super(geometry)

    const { canvas, context } = canvasPool.take(3, 3)
    this.canvas = canvas
    this.context = context
    this._texture = Texture.from(canvas)
    this._texture.orig = new Rectangle()
    this._texture.trim = new Rectangle()
  }

  _calculateBounds() {
    this.finishPoly()
    const { geometry } = this
    if (!geometry.graphicsData.length) {
      return
    }
    const { minX, minY, maxX, maxY } = geometry.bounds
    console.info(geometry.bounds)
    this._bounds.addFrame(this.transform, minX, minY, maxX, maxY)
  }

  calculateVertices(): void {
    const texture = this._texture

    if (this._transformID === this.transform._worldID && this._textureID === texture._updateID) {
      return
    }

    // update texture UV here, because base texture can be changed without calling `_onTextureUpdate`
    if (this._textureID !== texture._updateID) {
      this.uvs = this._texture._uvs.uvsFloat32
    }

    this._transformID = this.transform._worldID
    this._textureID = texture._updateID

    const localBounds = this.getLocalBounds()

    // set the vertex data
    const wt = this.transform.worldTransform
    const a = wt.a
    const b = wt.b
    const c = wt.c
    const d = wt.d
    const tx = wt.tx + localBounds.x
    const ty = wt.ty + localBounds.y
    const vertexData = this.vertexData
    const trim = texture.trim
    const orig = texture.orig
    const anchor = this._anchor

    let w0 = 0
    let w1 = 0
    let h0 = 0
    let h1 = 0

    if (trim) {
      // if the sprite is trimmed and is not a tilingsprite then we need to add the extra
      // space before transforming the sprite coords.
      w1 = trim.x - (anchor.x * orig.width)
      w0 = w1 + trim.width

      h1 = trim.y - (anchor.y * orig.height)
      h0 = h1 + trim.height
    }
    else {
      w1 = -anchor.x * orig.width
      w0 = w1 + orig.width

      h1 = -anchor.y * orig.height
      h0 = h1 + orig.height
    }

    // xy
    vertexData[0] = (a * w1) + (c * h1) + tx
    vertexData[1] = (d * h1) + (b * w1) + ty

    // xy
    vertexData[2] = (a * w0) + (c * h1) + tx
    vertexData[3] = (d * h1) + (b * w0) + ty

    // xy
    vertexData[4] = (a * w0) + (c * h0) + tx
    vertexData[5] = (d * h0) + (b * w0) + ty

    // xy
    vertexData[6] = (a * w1) + (c * h0) + tx
    vertexData[7] = (d * h0) + (b * w1) + ty
  }

  private updateTexture(resolution: number) {

    const geometryDirty = (this.geometry as any).dirty // dirty 是 protected
    if (this.geometryDirty !== geometryDirty) {
      this.geometryDirty = geometryDirty
      this.shouldUpdateTexture = true
    }

    if (this.resolution !== resolution) {
      this.resolution = resolution
      this.shouldUpdateTexture = true
    }

    if (!this.shouldUpdateTexture) {
      return
    }

    const localBounds = this.getLocalBounds()
    const {
      canvas,
      context,
      _texture,
    } = this

    const size = {
      width: localBounds.width,
      height: localBounds.height,
    }

    canvas.width = size.width * resolution
    canvas.height = size.height * resolution

    context.scale(resolution, resolution)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.translate(-localBounds.x, -localBounds.y)

    if (true) {
      context.shadowBlur = 4
      context.shadowColor = 'rgba(0, 0, 0, 0.25)'
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
    }

    cgrf.pushContext(context)
    cgrf.render(this)
    cgrf.popContext()

    if (this._debug) {
      context.strokeStyle = '#00ff00'
      context.lineWidth = 1
      context.strokeRect(
        localBounds.x,
        localBounds.y,
        localBounds.width,
        localBounds.height,
      )

      context.textBaseline = 'top'
      context.fillStyle = 'black'
      context.font = '14px Arial'
      context.fillText(`@${resolution}x`, localBounds.x, localBounds.y)
    }

    _texture.trim.width = _texture._frame.width = size.width
    _texture.trim.height = _texture._frame.height = size.height
    _texture.orig.width = _texture._frame.width
    _texture.orig.height = _texture._frame.height
    _texture.updateUvs()
    _texture.baseTexture.setRealSize(canvas.width, canvas.height, resolution)

    this.shouldUpdateTexture = false
  }

  protected _render(renderer: Renderer): void {
    if (this.isMask) {
      // 被当作 mask 使用时，仍然通过 gl 绘制
      super._render(renderer)
    } else {
      this.finishPoly()
      this.updateTexture(renderer.resolution)
      this.calculateVertices()
      renderer.batch.setObjectRenderer(renderer.plugins['batch'])
      renderer.plugins['batch'].render(this)
    }
  }

  destroy(options: IDestroyOptions | boolean) {
    super.destroy(options)
    canvasPool.return(this.canvas)
  }

  protected _draw?: Draw<GraphicsElement> | null
  /**
   * 通过 props 设置 `draw` 时，立即调用他以便重绘
   */
  set draw(value: Draw<GraphicsElement> | null) {
    if (this._draw === value) {
      return
    }
    this._draw = value
    this.clear()
    if (this._draw) {
      this._draw(this)
    }
  }

  private _debug = DEBUG_GRAPHICS

  /**
   * Get or set if debug mode
   */
  get debug() {
    return this._debug
  }

  set debug(value: boolean) {
    if (value === this._debug) {
      return
    }
    this.shouldUpdateTexture = true
    this._debug = value
  }
}

// 3. Factory
export function createGraphics(props?: GraphicsProps) {
  const el = new GraphicsElement()
  if (props) {
    defaultApplyProps(el, props)
  }
  return el
}
