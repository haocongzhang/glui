import { Container, ContainerProps, Graphics, GraphicsGl, Surface } from '@glui/core'
import { Children, FC, useMemo, useState } from 'react'
import { Grid } from './shared/gird'

const useHoverInteraction = <T extends (GraphicsGl | Graphics)>() => {
  const [hover, setHover] = useState(false)
  const props = useMemo(() => {
    return {
      draw: hover ?
        (g: T) => {
          g.beginFill(0xf3f3f2)
          g.lineStyle({ width: 8, color: 0xb44c97 })
          g.drawRect(0, 0, 100, 100)
          g.endFill()
        } : (g: T) => {
          g.beginFill(0xdcd6d9)
          g.lineStyle({ width: 8, color: 0xb44c97 })
          g.drawRoundedRect(0, 0, 100, 100, 16)
          g.endFill()
        },
      onMouseOver: () => {
        setHover(true)
      },
      onMouseOut: () => {
        setHover(false)
      },
    } as const
  }, [hover])
  return props
}

type FlexProps = ContainerProps & { boxWidth?: number }
const Flex: FC<FlexProps> = ({
  children,
  boxWidth = 200,
  ...props
}) => {
  const content = Children.map(children, (child, index) => {
    return (
      <Container
        x={index * boxWidth}
      >
        { child}
      </Container>
    )
  })

  return (
    <Container {...props}>
      { content}
    </Container>
  )
}

export const Basic: FC = () => {
  return (
    <Surface>
      <Grid />
      <Flex x={100} y={100}>
        <GLMode />
        <CanvasMode />
      </Flex>
    </Surface>
  )
}

const GLMode: FC = () => {
  const props = useHoverInteraction<GraphicsGl>()
  return (
    <GraphicsGl
      {...props}
      interactive={true}
    />
  )
}

const CanvasMode: FC = () => {
  const props = useHoverInteraction<Graphics>()
  return (
    <Graphics
      {...props}
      interactive={true}
    />
  )
}

export default {
  title: 'core/Graphics',
  decorators: [(Story: FC) => <div style={{ width: '100%', height: '100vh' }}><Story /></div>],
}
