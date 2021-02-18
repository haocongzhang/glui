import type { Key, ReactElement, ReactNode, Ref } from 'react'
import type {
  ContainerElement, ContainerProps,
  TextElement, TextProps,
  ImageElement, ImageProps,
  GraphicsElement, GraphicsProps,
  GraphicsGlElement, GraphicsGlProps,
  TextInputElement, TextInputProps,
} from './elements'

type BaseProps<E, P> = {
  key?: Key
  ref?: Ref<E>
  children?: ReactNode
} & P

function ElementFactory<E, P, T extends string>(type: T): (props: BaseProps<E, P>) => ReactElement<P, T> {
  return type as any
}

export const Container = ElementFactory<ContainerElement, ContainerProps, 'Container'>('Container')
export type Container = ContainerElement
export type { ContainerProps } from './elements'

export const Text = ElementFactory<TextElement, TextProps, 'Text'>('Text')
export type Text = TextElement

export const TextInput = ElementFactory<TextInputElement, TextInputProps, 'TextInput'>('TextInput')
export type TextInput = TextInputElement

export const Image = ElementFactory<ImageElement, ImageProps, 'Image'>('Image')
export type Image = ImageElement

export const Graphics = ElementFactory<GraphicsElement, GraphicsProps, 'Graphics'>('Graphics')
export type Graphics = GraphicsElement

export const GraphicsGl = ElementFactory<GraphicsGlElement, GraphicsGlProps, 'GraphicsGl'>('GraphicsGl')
export type GraphicsGl = GraphicsGlElement
export type { GraphicsGlProps } from './elements'

export type {
  EventHandler,
  EventTarget,
  EventTargetProps,
  InteractionEvent
} from './elements'
