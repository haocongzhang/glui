class CanvasPool {
  take (width = 3, height = 3) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error(`HTMLCanvasElement.getContext('2d') error.`)
    return { canvas, context }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  return (_canvas: HTMLCanvasElement) {
    
  }
}

export const canvasPool = new CanvasPool()
