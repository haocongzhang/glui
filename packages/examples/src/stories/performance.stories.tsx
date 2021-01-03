import {
  Container,
  Graphics, InteractionEvent, Surface,
  Text
} from '@glui/core'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

export const TextPerformance: FC = () => {
  const [count] = useState(() => {
    const N = 2000
    const COLUMN = 30
    const GRID_WIDTH = 40
    const GRID_HEIGHT = 20
    return Array.from(Array(N).keys()).map(index => {
      return {
        key: String(index),
        x: (index % COLUMN) * GRID_WIDTH,
        y: (Math.floor(index / COLUMN)) * GRID_HEIGHT,
        scale: 1,
      }
    })
  })

  const containerRef = useRef<Container>(null)

  useEffect(() => {
    let rafHandle: number
    const loop = () => {
      rafHandle = requestAnimationFrame(loop)
      containerRef.current?.children.forEach(it => {
        it.rotation += 0.01
      })
    }
    rafHandle = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafHandle)
    }
  }, [])

  const handleMouseEvent = (event: InteractionEvent) => {
    if (event.type === 'mouseover') {
      (event.currentTarget as Text).style.fill = 0xFF0000
    } else if (event.type === 'mouseout') {
      (event.currentTarget as Text).style.fill = 0
    }
  }

  const content = count.map(it => {
    return (
      <Text
        key={ it.key }
        x={ it.x }
        y={ it.y }
        text={ it.key }
        interactive={ true }
        onMouseOver={ handleMouseEvent }
        onMouseOut={ handleMouseEvent }
      />
    )
  })
  return (
    <Surface>
      <Container ref={ containerRef }>
        { content }
      </Container>
    </Surface>
  )
}

export const GraphicsPerformance: FC = () => {
  const [elements] = useState(() => {
    const N = 2000
    const COLUMN = 30
    const GRID_WIDTH = 40
    const GRID_HEIGHT = 40
    return Array.from(Array(N).keys()).map(index => {
      return {
        key: String(index),
        x: (index % COLUMN) * GRID_WIDTH,
        y: (Math.floor(index / COLUMN)) * GRID_HEIGHT,
        rotation: 0,
      }
    })
  })

  const containerRef = useRef<Container>(null)

  useEffect(() => {
    let rafHandle: number
    const loop = () => {
      rafHandle = requestAnimationFrame(loop)
      containerRef.current?.children.forEach(it => {
        it.rotation += 0.01
      })
    }
    rafHandle = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafHandle)
    }
  }, [])

  const drawOut = useCallback((g: Graphics) => {
      g.beginFill(0xdcd6d9)
      g.lineStyle({ width: 2, color: 0xb44c97 })
      g.drawRoundedRect(0, 0, 40, 40, 16)
      g.endFill()
  }, [])

  const handleMouseEvent = (event: InteractionEvent) => {
    if (event.type === 'mouseover') {
      (event.currentTarget as Graphics).draw = (g: Graphics) => {
        g.beginFill(0xf3f3f2)
        g.lineStyle({ width: 2, color: 0xb44c97 })
        g.drawRoundedRect(0, 0, 40, 40, 16)
        g.endFill()
      }
    } else if (event.type === 'mouseout') {
      (event.currentTarget as Graphics).draw = drawOut
    }
  }

  const content = elements.map(it => {
    return (
      <Container
        key={ it.key }
        x={ it.x }
        y={ it.y }
        interactive={ true }
        rotation={ it.rotation }
        onMouseOver={ handleMouseEvent }
        onMouseOut={ handleMouseEvent }
        cacheAsBitmap={ true }
      >
        <Graphics
          draw={ drawOut }
        />
        <Text text={ it.key } />
      </Container>
    )
  })
  return (
    <>
      <div>
        开启位图缓存时，可以看到绘制的矢量图形存在锯齿<br />
        这是因为 WebGL1 不支持 multisample renderbuffer 且只有 WebGL2 支持<br />
        从兼容性考虑，未来 Graphics 的绘制将会直接使用 Canvas2D，以便得到最佳的兼容性和质量。
      </div>
      <Surface>
        <Container ref={ containerRef }>
          { content }
        </Container>
      </Surface>
    </>
  )
}

export default {
  title: 'core/Performance',
  component: Text,
  decorators: [(Story: FC) => <div style={{ width: '100%', height: '100vh' }}><Story/></div>],
}
