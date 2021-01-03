import { useEffect } from 'react'

export type FrameCallback = (delta: number) => void

export const useFrame = (callback: FrameCallback): void => {
  useEffect(() => {
    callback(0) // dummy
  })
}

export const useSize = () => {
  return {}
}
