import { Graphics, Surface } from '@glui/core'
import { FC, useMemo, useState } from 'react'

export const GLMode: FC = () => {

  const [hover, setHover] = useState(false)
  const draw = useMemo(() => {
    return hover ? 
    (g: Graphics) => {
      g.beginFill(0xf3f3f2)
      g.lineStyle({ width: 2, color: 0xb44c97 })
      g.drawRoundedRect(0, 0, 100, 100, 32)
      g.endFill()
    } :
    (g: Graphics) => {
      g.beginFill(0xdcd6d9)
      g.lineStyle({ width: 2, color: 0xb44c97 })
      g.drawRoundedRect(0, 0, 100, 100, 16)
      g.endFill()
    }
  }, [hover])
 
  const handleMouseOver = () => {
    setHover(true)
  }
  const handleMouseOut = () => {
    setHover(false)
  }

  return (
    <Surface>
      <Graphics
        onMouseOver={ handleMouseOver }
        onMouseOut={ handleMouseOut }
        interactive={ true }
        x={ 10 }
        y={ 10 }
        draw={ draw }
      />
    </Surface>
  )
}

export const CanvasMode: FC = () => {
  return (
    <div>
      todo
    </div>
  )
}

export default {
  title: 'core/Graphics',
  decorators: [(Story: FC) => <div style={{ width: '100%', height: '100vh' }}><Story/></div>],
}
