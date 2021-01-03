import {
  Container,
  Image,
  Surface,
  Text
} from '@glui/core'
import { FC, useState } from 'react'
import BunnyImage from './assets/bunny.png'

export const Basic: FC = () => {

  const [bunnies, setBunnies] = useState(() => {
    return Array.from(Array(10).keys()).map(key => {
      return {
        key: String(key),
        x: 40 + key * 40,
        y: 100,
        scale: 1,
      }
    })
  })

  const [message, setMessage] = useState('')

  const zoom = (key: string, scale = 1.0) => {
    setMessage(`Bunny: ${key}`)
    setBunnies(prev => {
      return prev.map(it => {
        if (it.key === key) {
          return { ...it, scale }
        }
        return it
      })
    })
  }

  return (
    <Surface>
      <Container>
        { bunnies.map(({key, x, y, scale}) => {
          const handleMouseOver = () => {
            zoom(key, 1.2)
          }
          const handleMouseOut = () => {
            zoom(key, 1.0)
          }
          return (
            <Image
              key={key}
              href={BunnyImage}
              x={x}
              y={y}
              scaleX={ scale }
              scaleY={ scale }
              anchorX={ 0.5 }
              anchorY={ 0.5 }
              interactive={ true }
              onMouseOver={ handleMouseOver }
              onMouseOut={ handleMouseOut }
              cursor={ 'pointer' }
            />
          )
        }) }
        <Text text={ message } />
      </Container>
    </Surface>
  )
}

export default {
  title: 'core/Image',
  component: Image,
  decorators: [(Story: FC) => <div style={{ width: '100%', height: '100vh' }}><Story/></div>],
}
