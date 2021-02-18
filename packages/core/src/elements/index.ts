import { ContainerElement, ContainerProps, createContainer } from './container'
import { createGraphics, createGraphicsGl, GraphicsElement, GraphicsProps, GraphicsGlElement, GraphicsGlProps } from './graphics'
import { createImage, ImageElement, ImageProps } from './image'
import { createText, TextElement, TextProps } from './text'
import { createTextInput, TextInputElement, TextInputProps } from './text-input'
import type { AnyProps } from './utils'

export type ElementType =
  'Container'
  | 'Image' 
  | 'Text' 
  | 'Graphics' 
  | 'GraphicsGl'
  | 'ScrollView'
  | 'TextInput'

export type { ContainerElement, ContainerProps } from './container'
export * from './event-target'
export type { Draw, GraphicsElement, GraphicsProps, GraphicsGlElement, GraphicsGlProps } from './graphics'
export type { ImageElement, ImageProps } from './image'
export type { TextElement, TextProps } from './text'
export type { TextInputElement, TextInputProps } from './text-input'
export type { AnyElement, AnyProps, UpdatePayload } from './utils'

export function createElement (type: 'Container', props?: ContainerProps): ContainerElement

export function createElement (type: 'Text', props?: TextProps): TextElement

export function createElement (type: 'Image', props?: ImageProps): ImageElement

export function createElement (type: 'Graphics', props?: GraphicsProps): GraphicsElement

export function createElement (type: 'GraphicsGl', props?: GraphicsGlProps): GraphicsGlElement

export function createElement (type: 'TextInput', props?: TextInputProps): TextInputElement

export function createElement (type: ElementType, props?: AnyProps): ContainerElement {
  if (type === 'Container') {
    return createContainer(props as ContainerProps)
  } else if (type === 'Text') {
    return createText(props as TextProps)
  } else if (type === 'Image') {
    return createImage(props as ImageProps)
  } else if (type === 'Graphics') {
    return createGraphics(props as GraphicsProps)
  } else if (type === 'GraphicsGl') {
    return createGraphicsGl(props as GraphicsGlProps)
  } else if (type === 'TextInput') {
    return createTextInput(props as TextInputProps)
  } else if (type === 'ScrollView') {
    throw new Error(`ScrollView is not implemented yet`)
  }

  throw new Error(`createElement error: invalid type: ${type}`)
}


