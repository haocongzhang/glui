import {
  Container,
  createElement,
  createPortal,
  InteractionEvent,
  Surface,
  Text,
  useCanvasState
} from '@glui/core'
import { FC, useState } from 'react'

export const Portal: FC = () => {
  return (
    <Surface>
      <PortalContent />
    </Surface>
  )
}

const PortalContent: FC = () => {
  const { stage, height } = useCanvasState()
  const [portalContainer] = useState(() => {
    const container = createElement('Container')
    stage.addChild(container)
    return container
  })
  const [{ x, y }, setPosition] = useState({x: NaN, y: NaN})

  const handleMove = (event: InteractionEvent) => {
    setPosition(event.data.getLocalPosition(event.currentTarget))
  }
  return (
    <Container cursor={ 'pointer' } interactive={ true } onMouseMove={handleMove} y={height / 2}>
      <Text text='私はガラスを食べられます。それは私を傷つけません。' />
      { (!isNaN(x) && !isNaN(y)) && <Text text={`(${x}, ${y})`} y={30} /> }
      { createPortal(<Text text='我能吞下玻璃而不伤身体。' />, portalContainer) }
    </Container>
  )
}

export const OnReady: FC = () => {
  const [ready, setReady] = useState(false) 
  const handleReady = () => {
    setReady(true)
  }
  return (
    <div>
      <span>ready: {String(ready)}</span>
      <Surface onReady={ handleReady } />
    </div>
  )
}

export default {
  title: 'core/Surface',
  component: Surface,
  decorators: [(Story: FC) => <div style={{ width: '100%', height: '100vh' }}><Story/></div>],
}
