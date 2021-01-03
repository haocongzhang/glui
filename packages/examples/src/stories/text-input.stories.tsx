import {
  Surface,
  TextInput,
  Text,
} from '@glui/core'
import { FC, useState } from 'react'

export const Uncontrolled: FC = () => {
  const [value, setValue] = useState('')
  const handleInput = (event: Event) => {
    setValue((event.target as HTMLInputElement).value)
  }
  return (
    <Surface>
      <TextInput
        defaultValue="Enter text..."
        onInput={ handleInput }
        width={ 100 }
      />
      <Text 
        y={ 20 }
        text={ value }
      />
    </Surface>
  )
}

export default {
  title: 'core/TextInput',
  component: TextInput,
  decorators: [(Story: FC) => <div style={{ width: '100%', height: '100vh' }}><Story/></div>],
}
