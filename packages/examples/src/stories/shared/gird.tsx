import { GraphicsGl, GraphicsGlProps } from '@glui/core'
import { memo } from 'react'

type GridProps = {
  lineStyle?: { width: number, color: number, alpha: number }
  gridSize?: { x: number, y: number }
} & GraphicsGlProps

export const Grid = memo(({
  lineStyle = { color: 0, width: 1, alpha: 0.1 },
  gridSize = { x: 20, y: 20 },
}: GridProps) => {

  const screen = {
    width: 1000,
    height: 1000,
  }

  const draw = (g: GraphicsGl) => {
    g.lineStyle(lineStyle)

    // x direction (draw vertical line)
    for (let x = gridSize.x; x < screen.width; x += gridSize.x) {
      g.moveTo(x, 0)
      g.lineTo(x, screen.height)
    }

    // y direction (draw horizontal line)
    for (let y = gridSize.y; y < screen.height; y += gridSize.y) {
      g.moveTo(0, y)
      g.lineTo(screen.width, y)
    }
  }

  return (
    <GraphicsGl draw={draw} />
  )
})