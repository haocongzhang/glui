import {
  Surface,
  Text
} from '@glui/core'
import { FC } from 'react'

export const Basic: FC = () => {
  return (
    <Surface>
      <Text
        text='Hello World 🍻 你好世界。'
      />
    </Surface>
  )
}

export default {
  title: 'core/Text',
  component: Text,
  decorators: [(Story: FC) => <div style={{ width: '100%', height: '100vh' }}><Story/></div>],
}
